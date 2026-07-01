"""
Django management command: seed_professors

Seeds the database with the official University of The Bahamas faculty list.
- Removes professors NOT in the official list who have no reviews.
- Creates professors in the list who do not already exist (matched by exact name).

Safe to run multiple times.

Usage:
    python manage.py seed_professors
"""

from django.db.models import Count
from django.utils.text import slugify
from django.core.management.base import BaseCommand

from professors.models import Professor

PROFESSORS = [
    # (Full Name, Department)
    ("Acchia Albury", "Biology"),
    ("Adelle Thomas", "Geography"),
    ("Agustin Barrientos", "Spanish"),
    ("Alvaro Bonilla-Chinchilla", "Spanish"),
    ("Andre Neely", "Educational Technology"),
    ("Andrew Moxey", "Chemistry"),
    ("Bernadette Robins", "Administrative Office Management"),
    ("Beulah Gardiner-Farquharson", "Special Education"),
    ("Brenda Bain", "Special Education"),
    ("Bridget Rolle-Hogg", "Chemistry"),
    ("Bridgette Cooper", "Education"),
    ("Brigitte Major-Donaldson", "Management & Marketing"),
    ("Brianne Jaquette", "English"),
    ("Carol Moss", "English"),
    ("Chaker Eid", "Computer Information Systems"),
    ("Christine Diment", "French"),
    ("Christine Gangelhoff", "Music"),
    ("Christine Kozikowski", "English"),
    ("Christian Justilien", "Music"),
    ("Coralee Kelly", "Literacy & Language Arts"),
    ("Craig Smith", "English"),
    ("Dale McHardy", "Banking, Finance & Economics"),
    ("Daniel Thompson", "Management & Marketing"),
    ("Danny Davis", "Chemistry"),
    ("David Pinder", "Accounting"),
    ("Deborah Wright", "Special Education"),
    ("Devain Maycock", "Food and Beverage"),
    ("Dion Hepburn", "Chemistry"),
    ("Dudrick Edwards", "Computer Information Systems"),
    ("Earla Carey-Baines", "English"),
    ("Eardley Grant", "Computer Information Systems"),
    ("Emma Renee Chase", "Early Childhood Education"),
    ("Erecia Hepburn", "Biology"),
    ("Esmond Weekes", "Management & Marketing"),
    ("Faith Butler", "Research Methods"),
    ("Florence Anne Albury-Lawlor", "Linguistics and Composition"),
    ("Georgios Karotsis", "Chemistry"),
    ("Glen Holden", "Chemistry"),
    ("Glenville Davis", "Management & Marketing"),
    ("Gloria Gomez", "Social Studies & Environmental Education"),
    ("Gregg Ward", "Biology"),
    ("Haldane Chase", "French"),
    ("Helean McPhee", "English & Linguistics"),
    ("Heino Schmid", "Art"),
    ("Ian Bethell-Bennett", "Liberal and Fine Arts"),
    ("Ian Strachan", "English"),
    ("Ivy Higgins", "English"),
    ("Jacklyn Chisholm-Lightbourne", "Biology"),
    ("Jacinth Taylor", "Spanish"),
    ("Janice Munnings", "English and Educational Foundations"),
    ("Jason Greaves", "Chemistry"),
    ("Jaycoda Major", "Chemistry"),
    ("Jean-Benito Mercier", "Haitian Creole/French"),
    ("Jelena Andrejic", "Biology"),
    ("Jennifer Isaacs-Dotson", "Physical Education"),
    ("Jose Velasquez", "Banking, Finance and Economics"),
    ("JoyAnne Thompson", "Biology"),
    ("June Wilson", "Computer Information Systems"),
    ("Jyoti Choudhury", "Accounting"),
    ("Karen Lockhart", "Accounting"),
    ("Kathiann Antonio", "Supervision & Management"),
    ("Kayla Stubbs", "Biology"),
    ("Keisha Oliver", "Design / Visual Arts"),
    ("Keithley Woolward", "French"),
    ("Kelly Duncanson", "Accounting"),
    ("Kendra Chanti Seymour", "English & Linguistics"),
    ("Krista Walkes-Francis", "English"),
    ("Lester A. Flowers", "Biology"),
    ("Lionel Johnson", "Biology"),
    ("Lottis Shearer-Knowles", "Journalism & Communication"),
    ("Marcella Elliott-Ferguson", "Mathematics"),
    ("Marcia Seymour-Miles", "Management & Marketing"),
    ("Margo Blackwell", "Literacy"),
    ("Marie Sairsingh", "English"),
    ("Mario Adderley", "Food and Beverage"),
    ("Marjorie Downie", "English"),
    ("Mark Humes", "English"),
    ("Mauricio Cabrera", "Spanish"),
    ("Mayuri Deka", "English"),
    ("Michelle Barr-Cunningham", "Computer Information Systems"),
    ("Michael Edwards", "Art"),
    ("Michael Rolle", "Management & Marketing"),
    ("Monique McFarlane-Bain", "Language Resource Centre"),
    ("Monique Toppin", "Journalism & Communication"),
    ("Nathan Dawson", "Physics"),
    ("Neresa Wallace-Bandelier", "Early Childhood Education"),
    ("Olivia Saunders", "Banking, Finance and Economics"),
    ("Pamela Stubbs-Collins", "Spanish"),
    ("Pandora Johnson", "Educational Foundations"),
    ("Paola Alvino", "Journalism & Communication"),
    ("Paul De Luca", "Biology"),
    ("Paul Jones", "Music"),
    ("Paul McCann", "Physical Education"),
    ("Peter Bailey", "English"),
    ("Peter Daniels", "Management & Marketing"),
    ("Peter McWilliam", "Mathematics Education"),
    ("Philip Smith", "Children's Literature"),
    ("Randy Forbes", "Banking, Finance and Economics"),
    ("Raquel Barr-Edgecombe", "Family and Consumer Science Education"),
    ("Raymond Hounfodji", "French"),
    ("Raymond Oenbring", "English & Linguistics"),
    ("Remelda Moxey", "Accounting"),
    ("Rory Scriven", "Chemistry"),
    ("Rosemary McTier", "English"),
    ("Ruth Sumner", "Literacy & Language Arts"),
    ("Sandra Phillip-Burrows", "Geography"),
    ("Shaniqua Higgs", "English"),
    ("Thalia Micklewhite", "Science Education"),
    ("Teo Cooper", "Science Education"),
    ("Veronica Ferguson", "Science Education"),
    ("Veronica Toppin", "Biology"),
    ("Wallace Turner", "Music & Technology"),
    ("Walteria Tucker", "Spanish"),
    ("Wendy Riley", "Educational Technology"),
    ("Winston Mitchell", "Journalism & Communication"),
    ("Yvette Stuart", "Journalism & Communication"),
]


def _make_slug(name):
    base = slugify(name) or "professor"
    slug = base
    counter = 2
    while Professor.objects.filter(slug=slug).exists():
        slug = f"{base}-{counter}"
        counter += 1
    return slug


class Command(BaseCommand):
    help = "Seed the database with the official UB faculty list and remove unofficial professors with no reviews."

    def handle(self, *args, **options):
        official_names = {name for name, _ in PROFESSORS}

        # Remove professors not in the official list who have no reviews
        removed = (
            Professor.objects.exclude(name__in=official_names)
            .annotate(review_count=Count("reviews"))
            .filter(review_count=0)
            .delete()
        )
        removed_count = removed[0] if removed else 0
        if removed_count:
            self.stdout.write(f"  Removed {removed_count} unofficial professor(s) with no reviews.")

        # Create professors not already in the database
        existing = set(Professor.objects.values_list("name", flat=True))
        created = 0
        for name, department in PROFESSORS:
            if name in existing:
                continue
            Professor.objects.create(name=name, department=department, slug=_make_slug(name))
            existing.add(name)
            created += 1

        self.stdout.write(self.style.SUCCESS(f"Done. Created {created} new professor(s)."))

import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

function Section({ title, children }) {
  return (
    <section className="mt-8">
      <h2 className="text-lg font-serif font-bold text-blue-900">{title}</h2>
      <div className="mt-2 space-y-3 text-slate-700 leading-relaxed">{children}</div>
    </section>
  )
}

function TermsOfService() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar showSearch={false} />

      <article className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-serif font-bold text-blue-900">Terms of Service</h1>
        <p className="mt-2 text-sm text-slate-500">Last updated: July 27, 2026</p>

        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          This is a draft prepared to reflect how Know Before You Go Bahamas actually
          works today. It has not been reviewed by a licensed attorney. Because this
          Service involves user-submitted opinions about identifiable people, have this
          reviewed by counsel — particularly the content-moderation and liability
          sections — before relying on it.
        </div>

        <Section title="1. Acceptance of these terms">
          <p>
            These Terms of Service ("Terms") govern your access to and use of Know Before
            You Go Bahamas (the "Service"), operated by{' '}
            <strong>Anthony Barona Burrows</strong> ("we," "us"). By creating an account or
            otherwise using the Service, you agree to these Terms and to our{' '}
            <Link to="/privacy" className="text-blue-900 hover:underline">
              Privacy Policy
            </Link>
            . If you don't agree, don't use the Service.
          </p>
        </Section>

        <Section title="2. What the Service is">
          <p>
            Know Before You Go Bahamas lets University of The Bahamas students share and
            read ratings and reviews of professors and courses. Ratings, difficulty
            scores, and comments submitted on the Service are the personal opinions of
            individual users, not statements of fact verified by us, and not endorsed by
            or affiliated with the University of The Bahamas.
          </p>
        </Section>

        <Section title="3. Eligibility and accounts">
          <p>
            Account registration currently requires a valid University of The Bahamas
            (@ub.edu.bs) email address. You must provide accurate information when you
            register and are responsible for maintaining the confidentiality of your
            password and for all activity under your account. Notify us immediately at{' '}
            <a href="mailto:support@knowbeforeyougobahamas.com" className="text-blue-900 hover:underline">
              support@knowbeforeyougobahamas.com
            </a>{' '}
            if you suspect unauthorized use of your account.
          </p>
          <p>
            You must be capable of forming a legally binding contract to use the Service.
            The Service is not directed at children under 13.
          </p>
        </Section>

        <Section title="4. Your content">
          <p>
            When you submit a rating, comment, or other content ("User Content"), you
            retain ownership of it. You grant us a worldwide, royalty-free, non-exclusive
            license to host, store, reproduce, and display that User Content on the
            Service (including anonymized to other users) for as long as you keep it
            posted, and as needed to operate, secure, and improve the Service.
          </p>
          <p>
            You're solely responsible for your User Content. You can edit or delete your
            own ratings at any time from the "My Ratings" page, and deleting a rating
            removes it from the Service (subject to any copies we're required to retain
            for legal or record-keeping purposes, such as investigating a complaint filed
            before deletion).
          </p>
        </Section>

        <Section title="5. Content standards">
          <p>You agree not to post User Content that:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Is defamatory, knowingly false, or made with reckless disregard for the truth</li>
            <li>Harasses, threatens, or targets someone based on a protected characteristic</li>
            <li>Discloses another person's private, non-public personal information</li>
            <li>Is obscene, hateful, or contains content our automated profanity filter is designed to catch (attempting to evade it is also a violation)</li>
            <li>Is unrelated to a genuine experience with the professor or course being reviewed</li>
            <li>Infringes someone else's intellectual property or other legal rights</li>
          </ul>
          <p>
            We may remove User Content, or suspend or terminate an account, that violates
            these standards, at our discretion and without prior notice.
          </p>
        </Section>

        <Section title="6. Disputing a review">
          <p>
            If you are a professor or other individual who believes a review about you on
            the Service is false, defamatory, or otherwise violates these Terms, contact
            us at{' '}
            <a href="mailto:support@knowbeforeyougobahamas.com" className="text-blue-900 hover:underline">
              support@knowbeforeyougobahamas.com
            </a>{' '}
            with the specific review and the basis for your complaint. We'll review the
            report and take appropriate action, which may include removing the content,
            leaving it in place, or contacting the author.
          </p>
        </Section>

        <Section title="7. Prohibited conduct">
          <p>Beyond the content standards above, you agree not to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Create an account using a false identity or an email address you're not authorized to use</li>
            <li>Create multiple accounts to submit multiple reviews for the same professor/course pairing, or otherwise manipulate ratings</li>
            <li>Attempt to access another user's account or non-public parts of the Service</li>
            <li>Scrape, crawl, or bulk-extract data from the Service without our written permission</li>
            <li>Interfere with or disrupt the Service or its infrastructure</li>
            <li>Use the Service for any unlawful purpose</li>
          </ul>
        </Section>

        <Section title="8. Third-party sign-in">
          <p>
            You may sign in using Google. Your use of Google's sign-in service is also
            subject to Google's own terms and privacy policy, which we don't control.
          </p>
        </Section>

        <Section title="9. Intellectual property">
          <p>
            The Service's design, code, and branding are owned by us and may not be
            copied or reused without permission. Publicly available course and professor
            information (e.g. course codes and names) is used for reference purposes and
            is not claimed as our proprietary content.
          </p>
        </Section>

        <Section title="10. Disclaimers">
          <p>
            The Service and all User Content are provided "as is," without warranties of
            any kind. We do not verify the accuracy of ratings or reviews, and we are not
            responsible for decisions made in reliance on them. To the fullest extent
            permitted by law, we disclaim all warranties, express or implied, including
            fitness for a particular purpose and non-infringement.
          </p>
        </Section>

        <Section title="11. Limitation of liability">
          <p>
            To the fullest extent permitted by law, we will not be liable for any
            indirect, incidental, special, or consequential damages arising from your use
            of the Service or any User Content, even if we've been advised of the
            possibility of such damages. Our total liability for any claim relating to the
            Service will not exceed the amount, if any, you've paid us in the twelve
            months before the claim arose.
          </p>
        </Section>

        <Section title="12. Indemnification">
          <p>
            You agree to indemnify and hold us harmless from any claim or demand,
            including reasonable legal fees, arising out of your use of the Service, your
            User Content, or your violation of these Terms.
          </p>
        </Section>

        <Section title="13. Termination">
          <p>
            You may stop using the Service and request account deletion at any time. We
            may suspend or terminate your access to the Service, with or without notice,
            if we believe you've violated these Terms.
          </p>
        </Section>

        <Section title="14. Changes to these terms">
          <p>
            We may update these Terms from time to time. If we make material changes,
            we'll update the "Last updated" date above. Continued use of the Service after
            a change means you accept the updated Terms.
          </p>
        </Section>

        <Section title="15. Governing law">
          <p>
            These Terms are governed by the laws of the Commonwealth of The Bahamas,
            without regard to its conflict-of-law principles, and any dispute arising from
            these Terms or the Service will be subject to the exclusive jurisdiction of
            the courts of The Bahamas.
          </p>
        </Section>

        <Section title="16. Contact">
          <p>
            Questions about these Terms can be sent to{' '}
            <a href="mailto:support@knowbeforeyougobahamas.com" className="text-blue-900 hover:underline">
              support@knowbeforeyougobahamas.com
            </a>
            .
          </p>
        </Section>
      </article>
    </div>
  )
}

export default TermsOfService

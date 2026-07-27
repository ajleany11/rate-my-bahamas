import Navbar from '../components/Navbar'

function Section({ title, children }) {
  return (
    <section className="mt-8">
      <h2 className="text-lg font-serif font-bold text-blue-900">{title}</h2>
      <div className="mt-2 space-y-3 text-slate-700 leading-relaxed">{children}</div>
    </section>
  )
}

function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar showSearch={false} />

      <article className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-serif font-bold text-blue-900">Privacy Policy</h1>
        <p className="mt-2 text-sm text-slate-500">Last updated: July 27, 2026</p>

        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          This policy was drafted to accurately describe what Know Before You Go Bahamas
          actually collects and does with data as of the date above. It has not been
          reviewed by a licensed attorney. Before relying on it, have it reviewed by
          counsel familiar with the laws of The Bahamas (including the Data Protection
          Act, 2003, as amended) and any other jurisdiction your users are in.
        </div>

        <Section title="Who we are">
          <p>
            Know Before You Go Bahamas ("we," "us," "the Service") is a platform where
            students of the University of The Bahamas can rate and review professors and
            courses. The Service is operated by{' '}
            <strong>Anthony Barona Burrows</strong>. For any question about this policy or
            your data, contact{' '}
            <a href="mailto:support@knowbeforeyougobahamas.com" className="text-blue-900 hover:underline">
              support@knowbeforeyougobahamas.com
            </a>
            . 
          </p>
        </Section>

        <Section title="Information we collect">
          <p><strong>Account information.</strong> To create an account you provide your full name, your University of The Bahamas email address (a @ub.edu.bs address is required), and a password, which we store as a salted hash — we never store or can see your plaintext password. If you sign in with Google instead, we receive your name and email address from Google.</p>
          <p><strong>Verification codes.</strong> When you sign up or reset your password, we generate a short-lived numeric code and email it to you to confirm you control that inbox. These codes expire automatically and are deleted or invalidated after use.</p>
          <p><strong>Ratings and reviews you submit.</strong> When you rate a professor, we store your quality rating, difficulty rating, whether you'd take the professor again, whether they use a textbook, and any written comment you add. Submissions are automatically screened for profanity before being accepted.</p>
          <p><strong>Standard technical data.</strong> Like virtually all web services, our hosting infrastructure automatically logs standard technical information (such as IP address, browser type, and request timestamps) for security, abuse-prevention, and diagnostic purposes. We do not use this data for advertising or behavioral tracking.</p>
        </Section>

        <Section title="What we don't do">
          <p>
            We do not use cookies for tracking or advertising. Signing in stores an access
            token in your browser's local storage, not a tracking cookie. We do not run
            analytics, advertising, or social-media tracking scripts on the Service. We do
            not sell your personal information to anyone, ever.
          </p>
        </Section>

        <Section title="How reviews are shown to others">
          <p>
            Ratings and reviews are displayed to other users <strong>anonymously</strong> —
            we do not show your name, email, or any identifying information alongside a
            review. Internally, every review remains linked to your account so that you
            can view, edit, and delete your own ratings at any time from the "My Ratings"
            page, and so we can investigate abuse reports or legal complaints about specific
            content. We may disclose the identity of a review's author if required by law,
            to enforce our Terms of Service, or to investigate a good-faith claim that a
            review is defamatory, harassing, or otherwise unlawful.
          </p>
        </Section>

        <Section title="How we use your information">
          <ul className="list-disc pl-5 space-y-1">
            <li>To create and secure your account, and authenticate you when you sign in</li>
            <li>To display your ratings/reviews (anonymously) to other users</li>
            <li>To let you view, edit, and delete the ratings you've submitted</li>
            <li>To send you account-related emails (verification codes, password resets)</li>
            <li>To detect, investigate, and prevent abuse, spam, or violations of our Terms of Service</li>
            <li>To maintain and improve the reliability and security of the Service</li>
          </ul>
        </Section>

        <Section title="Who we share information with">
          <p>We share information with a small number of service providers who help us run the Service, and with no one else for marketing or advertising purposes:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Google</strong> — if you choose to sign in with Google, Google processes that authentication.</li>
            <li><strong>Resend</strong> — our transactional email provider, used solely to deliver verification and password-reset emails.</li>
            <li><strong>Railway</strong> — our hosting provider, which runs our servers and database.</li>
            <li><strong>Google Search Console and Bing Webmaster Tools</strong> — we use these to monitor and improve how our public pages (e.g. professor and course pages) appear in search results. They don't run tracking scripts or collect information about individual visitors; they reflect aggregate data from Google's and Bing's own crawling and indexing of our public pages, which happens for any public website regardless of these tools.</li>
          </ul>
          <p>
            We may also disclose information if required to do so by law, or in a good-faith
            belief that disclosure is necessary to comply with a legal obligation, protect
            the rights or safety of our users or the public, or investigate fraud or abuse.
          </p>
        </Section>

        <Section title="Data retention">
          <p>
            We keep your account and review data for as long as your account exists.
            Verification codes and pending (unverified) signups expire automatically within
            a short window and are not retained afterward. If you'd like your account and
            associated data deleted, contact us at the email above — we don't yet have a
            self-service "delete my account" button, so this is handled manually on
            request.
          </p>
        </Section>

        <Section title="Your choices">
          <ul className="list-disc pl-5 space-y-1">
            <li>You can edit or delete any rating you've submitted at any time from the "My Ratings" page.</li>
            <li>You can ask us to correct inaccurate account information.</li>
            <li>You can ask us to delete your account and associated data, subject to any legal or content-moderation records we're permitted or required to keep.</li>
          </ul>
        </Section>

        <Section title="Children's privacy">
          <p>
            The Service is intended for university students and is not directed at, nor
            knowingly used to collect information from, children under 13. If you believe a
            child has provided us with personal information, contact us and we'll delete it.
          </p>
        </Section>

        <Section title="International data transfers">
          <p>
            Our users are primarily located in The Bahamas, but our hosting provider and
            other service providers listed above may store or process data outside The
            Bahamas, including in the United States. By using the Service, you understand
            your information may be transferred to and processed in those locations.
          </p>
        </Section>

        <Section title="Changes to this policy">
          <p>
            We may update this policy from time to time. If we make material changes,
            we'll update the "Last updated" date above. Continued use of the Service after
            a change means you accept the updated policy.
          </p>
        </Section>

        <Section title="Contact us">
          <p>
            Questions, requests, or complaints about this policy or your data can be sent
            to{' '}
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

export default PrivacyPolicy

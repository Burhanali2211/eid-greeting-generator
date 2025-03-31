export default function TermsPage() {
  return (
    <div className="prose max-w-3xl mx-auto">
      <h1 className="text-eid-emerald-700">Terms of Service</h1>
      <p>
        Last updated: {new Date().toLocaleDateString()}
      </p>
      
      <h2>Introduction</h2>
      <p>
        Welcome to the Eid Greeting Generator! These Terms of Service govern your use of our website and service.
      </p>
      
      <h2>Acceptance of Terms</h2>
      <p>
        By accessing or using our service, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not use our service.
      </p>
      
      <h2>Use of Service</h2>
      <p>
        Our service allows you to create virtual Eid greetings with interactive Eidi cards. You may:
      </p>
      <ul>
        <li>Create and share greetings with others</li>
        <li>Specify Eidi amounts in your greetings</li>
        <li>Track which greetings have been viewed and claimed</li>
      </ul>
      
      <h2>User Responsibilities</h2>
      <p>
        When using our service, you agree not to:
      </p>
      <ul>
        <li>Use the service for any illegal purpose</li>
        <li>Send offensive or inappropriate content in your greetings</li>
        <li>Attempt to manipulate or circumvent the service's functionality</li>
        <li>Impersonate another person or entity</li>
      </ul>
      
      <h2>Intellectual Property</h2>
      <p>
        The Eid Greeting Generator and its original content, features, and functionality are owned by us and are protected by international copyright and trademark laws.
      </p>
      
      <h2>Disclaimer</h2>
      <p>
        Your use of our service is at your sole risk. The service is provided on an "AS IS" and "AS AVAILABLE" basis. We expressly disclaim all warranties of any kind, whether express or implied.
      </p>
      
      <h2>Limitation of Liability</h2>
      <p>
        We shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.
      </p>
      
      <h2>Changes to Terms</h2>
      <p>
        We reserve the right to modify or replace these Terms at any time. Your continued use of the service after any such changes constitutes your acceptance of the new Terms.
      </p>
      
      <h2>Contact Us</h2>
      <p>
        If you have any questions about these Terms, please contact us at support@eidgreetings.com.
      </p>
    </div>
  );
} 
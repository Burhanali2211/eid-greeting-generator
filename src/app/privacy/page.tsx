export default function PrivacyPage() {
  return (
    <div className="prose max-w-3xl mx-auto">
      <h1 className="text-eid-emerald-700">Privacy Policy</h1>
      <p>
        Last updated: {new Date().toLocaleDateString()}
      </p>
      
      <h2>Introduction</h2>
      <p>
        Welcome to the Eid Greeting Generator! This privacy policy outlines how we collect, use, and protect your information when you use our service.
      </p>
      
      <h2>Information We Collect</h2>
      <p>
        When you use our Eid Greeting Generator, we collect minimal information required to provide our service:
      </p>
      <ul>
        <li>A random identifier to associate you with your greetings</li>
        <li>Names of greeting recipients</li>
        <li>Custom messages you write</li>
        <li>Eidi amounts you specify</li>
      </ul>
      
      <h2>How We Use Your Information</h2>
      <p>
        We use your information solely to:
      </p>
      <ul>
        <li>Create and display your Eid greetings</li>
        <li>Allow recipients to view and interact with greetings</li>
        <li>Maintain a list of your sent greetings in your dashboard</li>
      </ul>
      
      <h2>Data Storage</h2>
      <p>
        Your data is stored securely in our Supabase database. We retain your greeting information for as long as is necessary to provide our service.
      </p>
      
      <h2>Your Rights</h2>
      <p>
        You have the right to:
      </p>
      <ul>
        <li>Access your data</li>
        <li>Request deletion of your data</li>
        <li>Request correction of your data</li>
      </ul>
      
      <h2>Changes to This Policy</h2>
      <p>
        We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page.
      </p>
      
      <h2>Contact Us</h2>
      <p>
        If you have any questions about this privacy policy, please contact us at support@eidgreetings.com.
      </p>
    </div>
  );
} 
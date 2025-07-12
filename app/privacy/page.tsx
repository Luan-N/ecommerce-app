export default function PrivacyPage() {
    return (
        <main className="my-25 mx-5 md:mx-15">
            <h1 className="text-2xl font-bold my-5 border-b">Privacy Policy</h1>
            <p>PC Linker (“we,” “us,” or “our”) respects your privacy and is committed to protecting any information you choose to store while using our PC-bookmarking features. This Privacy Policy explains what data we handle, how it&#39;s used, and how you control it.</p>
            <h2 className="text-xl font-bold my-2">Information We Collect</h2>
            <p>Local Storage Data. When you bookmark individual PC parts (e.g., CPU, GPU) or save a complete PC specification, that data is stored exclusively in your web browser&#39;s local storage on your device.</p>
            <p>When you submit your custom PC parts specs (e.g. CPU model, GPU model, RAM, motherboard, etc.) for compatibility analysis, we transmit only those part specifications from our server to the Google Gemini API. No personal identifiers (name, email, IP address) are included.</p>
            <p>Google Gemini processes your parts list to generate a compatibility report, which is then returned to our server and displayed to you. We do not store your parts data on our servers beyond the momentary processing needed to forward it and receive the response.</p>
            <p>Google Gemini may collect and process data as described in its privacy policy. We recommend reviewing their policy for more information.</p>
            <p>No Personal Data. We do not collect, process, or store any personally identifiable information (PII)—such as your name, email address, device identifiers, or IP address—on our servers.</p>
            <h2 className="text-xl font-bold my-2">How We Use Your Data</h2>
            <p>We use the data in your browser&#39;s local storage solely to display your saved parts and builds when you revisit or reload the site.</p>
            <p>We never transmit, share, or sell your bookmark data to any third parties or our own servers.</p>
            <h2 className="text-xl font-bold my-2">Data Storage & Security</h2>
            <p>Your bookmarked parts and builds are stored in your browser&#39;s local storage, which is secure and only accessible by you. We do not have access to this data.</p>
            <p>Local storage data is not transmitted over the internet, so it remains private and secure on your device.</p>
            <h2 className="text-xl font-bold my-2">Your Control</h2>
            <p>You can manage your bookmarked parts and builds directly through your browser:</p>
            <ul className="list-disc ml-5">
                <li>View and edit your saved bookmarks in the browser&#39;s developer tools.</li>
                <li>Delete individual bookmarks or clear all local storage data at any time.</li>
            </ul>
            <h2 className="text-xl font-bold my-2">Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any significant changes by posting a notice on our website or through other communication channels.</p>

            <p>Last Updated: July 7, 2025</p>

        </main>
    );
}
import { UploadIcon, VideoIcon, ZapIcon } from 'lucide-react';

export const featuresData = [
    {
        icon: <UploadIcon className="w-6 h-6" />,
        title: 'Precision Fabrication',
        desc: 'Custom laser-cut and CNC-fabricated stainless steel letters with tight tolerances.'
    },
    {
        icon: <ZapIcon className="w-6 h-6" />,
        title: 'Polishing & Finishes',
        desc: 'Brushed, mirror and painted finishes to match your brand aesthetic.'
    },
    {
        icon: <VideoIcon className="w-6 h-6" />,
        title: 'Installation & Support',
        desc: 'Professional installation and post-install support for commercial and residential sites.'
    }
];

export const plansData = [
    {
        id: 'basic',
        name: 'Basic',
        price: 'From $99',
        desc: 'Small letters and simple installations.',
        credits: 'One-time',
        features: [
            'Small stainless letters',
            'Standard polish',
            'Basic mounting hardware',
            'Local pickup'
        ]
    },
    {
        id: 'standard',
        name: 'Standard',
        price: 'From $299',
        desc: 'Most common for storefronts and offices.',
        credits: 'One-time',
        features: [
            'Medium to large letters',
            'Brushed or mirror finish',
            'On-site installation',
            '1 year warranty'
        ],
        popular: true
    },
    {
        id: 'premium',
        name: 'Premium',
        price: 'Custom',
        desc: 'Custom projects, illuminated letters, and large signage.',
        credits: 'Custom',
        features: [
            'Custom fabrication',
            'Lighting & illumination',
            'Full project management',
            'Extended warranty'
        ]
    }
];

export const faqData = [
    {
        question: 'What types of lettering and finishes do you offer?',
        answer: 'We offer brushed, mirror, painted and illuminated stainless steel letters in a range of thicknesses.'
    },
    {
        question: 'Do you provide installation?',
        answer: 'Yes — we provide professional on-site installation and mounting for most projects.'
    },
    {
        question: 'How long does fabrication take?',
        answer: 'Typical fabrication times range from 3–10 business days depending on project size and finish requirements.'
    },
    {
        question: 'Do you ship or only local pickup?',
        answer: 'We offer both local installation and shipping for finished letters. Large installations are typically handled in-person.'
    }
];

export const footerLinks = [
    {
        title: "Company",
        links: [
            { name: "Home", url: "#" },
            { name: "Products", url: "#" },
            { name: "Gallery", url: "#" },
            { name: "Contact", url: "#" }
        ]
    },
    {
        title: "Legal",
        links: [
            { name: "Privacy Policy", url: "#" },
            { name: "Terms of Service", url: "#" }
        ]
    },
    {
        title: "Contact",
        links: [
            { name: "Call us", url: "tel:+911234567890" },
            { name: "Email", url: "mailto:info@srisaisteelletters.com" },
            { name: "WhatsApp", url: "#" }
        ]
    }
];
import Title from '../components/Title';
import { motion } from 'framer-motion';

export default function OurWorks() {
    // Attempt to render available work images. By default we try .jpeg files (user uploaded),
    // and the onError handler will fall back to .jpg or .png if needed.
    const total = 11; // render slots 1..11 (adjust if you add more images)
    const images = Array.from({ length: total }).map((_, i) => `/works/${i + 1}.jpeg`);

    return (
        <section id="our-works" className="max-w-6xl mx-auto px-4 py-20">
            <Title title="Our Works" heading="Projects & Installations" description="A gallery of stainless steel letters, signboards and installations." />

            <motion.div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >
                {images.map((src, idx) => (
                    <div key={idx} className="rounded-lg overflow-hidden bg-gray-800/30 border border-white/6 h-48 flex items-center justify-center">
                        <img
                            src={src}
                            alt={`work-${idx + 1}`}
                            className="w-full h-full object-cover"
                            data-attempt="jpeg"
                            onError={(e) => {
                                const img = e.target as HTMLImageElement;
                                const attempt = img.dataset.attempt;
                                const n = idx + 1;
                                if (attempt === 'jpeg') {
                                    img.dataset.attempt = 'jpg';
                                    img.src = `/works/${n}.jpg`;
                                } else if (attempt === 'jpg') {
                                    img.dataset.attempt = 'png';
                                    img.src = `/works/${n}.png`;
                                } else {
                                    img.style.display = 'none';
                                }
                            }}
                        />
                    </div>
                ))}
            </motion.div>
        </section>
    );
}

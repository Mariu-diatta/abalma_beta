import React from 'react'

function TextParagraphs({ text }) {
    const paragraphs = text.split(". ").map(p => p.trim()).filter(p => p.length > 0);

    return (
        <div className="space-y-3 leading-relaxed text-gray-700">
            {paragraphs.map((p, index) => (
                <p key={index}>{p}.</p>
            ))}
        </div>
    );
}

export default TextParagraphs;
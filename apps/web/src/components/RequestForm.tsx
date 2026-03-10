'use client';

import { useState } from 'react';
import type { Locale, RequestType } from '@pan/shared';
import { createRequest } from '@pan/shared';
import type { Dictionary } from '@/lib/dictionaries';

interface Props {
    locale: Locale;
    dict: Dictionary;
    serviceId?: string;
    serviceName?: string;
}

export function RequestFormClient({ locale, dict, serviceId, serviceName }: Props) {
    const [type, setType] = useState<RequestType>(serviceId ? 'information' : 'information');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [company, setCompany] = useState('');
    const [subject, setSubject] = useState(serviceName ? `${dict.services.requestTypes[type]} — ${serviceName}` : '');
    const [message, setMessage] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [reference, setReference] = useState('');

    function handleTypeChange(newType: RequestType) {
        setType(newType);
        if (serviceName) {
            setSubject(`${dict.services.requestTypes[newType]} — ${serviceName}`);
        }
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
            alert(dict.services.formErrors.required);
            return;
        }

        const req = createRequest({
            type,
            subject,
            message,
            senderName: name,
            senderEmail: email,
            senderPhone: phone || undefined,
            senderCompany: company || undefined,
            serviceId,
        });

        setReference(req.reference);
        setSubmitted(true);
    }

    const isRtl = locale === 'ar';
    const inputClass = `w-full px-4 py-3 bg-pan-gray-50 border border-pan-gray-200 rounded-xl text-pan-navy text-sm placeholder:text-pan-gray-400 focus:outline-none focus:ring-2 focus:ring-pan-sky/30 focus:border-pan-sky transition-colors text-start`;
    const labelClass = 'block text-pan-navy text-sm font-medium mb-1.5';

    if (submitted) {
        return (
            <div className="text-center py-10">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-xl font-bold text-pan-navy mb-2">{dict.services.formSuccess.title}</h3>
                <p className="text-pan-gray-500 mb-4">{dict.services.formSuccess.message}</p>
                <div className="inline-block bg-pan-pale border border-pan-sky/20 rounded-xl px-6 py-3">
                    <span className="text-pan-gray-500 text-sm">{dict.services.formSuccess.reference}</span>
                    <div className="text-pan-sky font-mono font-bold text-lg">{reference}</div>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5" dir={isRtl ? 'rtl' : 'ltr'}>
            {/* Request type selector */}
            <div>
                <label className={labelClass}>{dict.services.formLabels.type}</label>
                <div className="flex flex-wrap gap-2">
                    {(Object.entries(dict.services.requestTypes) as [RequestType, string][]).map(([k, v]) => (
                        <button
                            key={k}
                            type="button"
                            onClick={() => handleTypeChange(k)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${type === k
                                ? 'bg-pan-sky text-white shadow-md'
                                : 'bg-pan-gray-100 text-pan-gray-600 hover:bg-pan-gray-200'
                                }`}
                        >
                            {v}
                        </button>
                    ))}
                </div>
            </div>

            {/* Name + Email */}
            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <label className={labelClass}>{dict.services.formLabels.name} *</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder={dict.services.formLabels.namePlaceholder} className={inputClass} required />
                </div>
                <div>
                    <label className={labelClass}>{dict.services.formLabels.email} *</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={dict.services.formLabels.emailPlaceholder} className={inputClass} required />
                </div>
            </div>

            {/* Phone + Company */}
            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <label className={labelClass}>{dict.services.formLabels.phone}</label>
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+222 XX XX XX XX" className={inputClass} />
                </div>
                <div>
                    <label className={labelClass}>{dict.services.formLabels.company}</label>
                    <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} placeholder={dict.services.formLabels.companyPlaceholder} className={inputClass} />
                </div>
            </div>

            {/* Subject */}
            <div>
                <label className={labelClass}>{dict.services.formLabels.subject} *</label>
                <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} className={inputClass} required />
            </div>

            {/* Message */}
            <div>
                <label className={labelClass}>{dict.services.formLabels.message} *</label>
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={5} placeholder={dict.services.formLabels.messagePlaceholder} className={inputClass} required />
            </div>

            {/* Attachments mock zone */}
            <div className="border-2 border-dashed border-pan-gray-200 rounded-xl p-5 text-center hover:border-pan-sky/40 transition-colors cursor-pointer">
                <span className="text-2xl block mb-1">📎</span>
                <span className="text-pan-gray-400 text-sm">{dict.services.formLabels.attachments}</span>
            </div>

            {/* Submit */}
            <button
                type="submit"
                className="w-full py-3.5 bg-pan-sky text-white font-semibold rounded-xl hover:bg-pan-blue transition-colors shadow-lg shadow-pan-sky/20 text-sm"
            >
                {dict.services.formLabels.submit}
            </button>
        </form>
    );
}

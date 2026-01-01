import React, { useState, useEffect } from 'react';
import { Save, Globe } from 'lucide-react';
import { useToast } from '../../../contexts/ToastContext';
import JoditEditor from 'jodit-react';
import { useParams } from 'react-router-dom';

// Configuration for what fields each page has
const PAGE_CONFIG = {
    home: {
        sections: [
            { id: 'hero', title: 'Hero Section', fields: [
                { key: 'title', label: 'Main Headline', type: 'text' },
                { key: 'subtitle', label: 'Subtitle', type: 'textarea' },
                { key: 'ctaText', label: 'CTA Button Text', type: 'text' },
                { key: 'heroVideo', label: 'Hero Video/Image URL', type: 'text' }
            ]},
            { id: 'stats', title: 'Statistics Bar', fields: [
                { key: 'stat1Label', label: 'Stat 1 Label', type: 'text' },
                { key: 'stat1Value', label: 'Stat 1 Value', type: 'text' },
                { key: 'stat2Label', label: 'Stat 2 Label', type: 'text' },
                { key: 'stat2Value', label: 'Stat 2 Value', type: 'text' },
                { key: 'stat3Label', label: 'Stat 3 Label', type: 'text' },
                { key: 'stat3Value', label: 'Stat 3 Value', type: 'text' },
                { key: 'stat4Label', label: 'Stat 4 Label', type: 'text' },
                { key: 'stat4Value', label: 'Stat 4 Value', type: 'text' }
            ]}
        ]
    },
    about: {
        sections: [
            { id: 'main', title: 'Main Content', fields: [
                { key: 'heading', label: 'Main Heading', type: 'text' },
                { key: 'intro', label: 'Introduction Text', type: 'richtext' }
            ]},
            { id: 'history', title: 'Our History', fields: [
                { key: 'historyText', label: 'History Content', type: 'richtext' }
            ]}
        ]
    },
    services: {
        sections: [
            { id: 'header', title: 'Header', fields: [
                { key: 'title', label: 'Page Title', type: 'text' },
                { key: 'description', label: 'Description', type: 'textarea' }
            ]}
        ]
    },
    products: {
        sections: [
            { id: 'header', title: 'Header', fields: [
                { key: 'title', label: 'Page Title', type: 'text' },
                { key: 'description', label: 'Description', type: 'textarea' }
            ]}
        ]
    },
    contact: {
         sections: [
            { id: 'header', title: 'Header', fields: [
                { key: 'title', label: 'Page Title', type: 'text' },
                { key: 'description', label: 'Description', type: 'textarea' }
            ]},
            { id: 'info', title: 'Contact Info', fields: [
                { key: 'address', label: 'Address', type: 'textarea' },
                { key: 'email', label: 'Email', type: 'text' },
                { key: 'phone', label: 'Phone', type: 'text' },
                { key: 'mapUrl', label: 'Google Maps Embed URL', type: 'text' }
            ]}
        ]
    },
    privacy: {
        sections: [
            { id: 'header', title: 'Header', fields: [
                { key: 'title', label: 'Page Title', type: 'text' },
                { key: 'description', label: 'Description', type: 'textarea' }
            ]},
            { id: 'content', title: 'Policy Content', fields: [
                { key: 'body', label: 'Full Privacy Policy', type: 'richtext' }
            ]}
        ]
    }
};

import { PAGE_DEFAULTS } from './pageDefaults';



const AdminPageEditor = () => {
    const { slug } = useParams();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [data, setData] = useState({ title: '', content: {}, seo: { metaTitle: '', metaDescription: '' } });
    const { success, error } = useToast();
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchPage();
    }, [slug]);

    const fetchPage = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/pages/${slug}`);
            const json = await res.json();
            
            // Initialize content if empty based on config
            const config = PAGE_CONFIG[slug];
            const initializedContent = json.content || {};

            if (config) {
                config.sections.forEach(section => {
                    if (!initializedContent[section.id]) {
                         // Fallback to PAGE_DEFAULTS if available
                         const defaultSection = PAGE_DEFAULTS[slug]?.[section.id];
                         initializedContent[section.id] = defaultSection || {};
                    }
                });
            }

            setData({
                title: json.title || (config ? slug.charAt(0).toUpperCase() + slug.slice(1) : ''),
                content: initializedContent,
                seo: json.seo || { metaTitle: '', metaDescription: '' }
            });
        } catch (err) {
            console.error(err);
            error('Failed to load page content');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch(`/api/pages/${slug}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });

            if (res.ok) {
                success('Page updated successfully');
            } else {
                throw new Error('Failed to update');
            }
        } catch (err) {
            error('Failed to save changes');
        } finally {
            setSaving(false);
        }
    };

    const updateContent = (sectionId, fieldKey, value) => {
        setData(prev => ({
            ...prev,
            content: {
                ...prev.content,
                [sectionId]: {
                    ...prev.content[sectionId],
                    [fieldKey]: value
                }
            }
        }));
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading editor...</div>;

    const config = PAGE_CONFIG[slug];
    if (!config) return <div className="p-8 text-center text-gray-500">No configuration found for this page.</div>;

    return (
        <form onSubmit={handleSave} className="max-w-4xl mx-auto pb-10">
             <div className="flex justify-between items-center mb-8 sticky top-0 bg-gray-50 dark:bg-gray-900 py-4 z-10 border-b border-gray-200 dark:border-gray-800">
                <div>
                     <h1 className="text-2xl font-bold text-gray-900 dark:text-white capitalize">Editing: {slug} Page</h1>
                     <p className="text-sm text-gray-500">Manage content and SEO settings</p>
                </div>
                <div className="flex gap-3">
                     <a href={`/${slug === 'home' ? '' : slug}`} target="_blank" rel="noreferrer" className="flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 transition-colors">
                        <Globe className="w-4 h-4 mr-2" /> View Live
                    </a>
                    <button type="submit" disabled={saving} className="flex items-center px-6 py-2 bg-secondary text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50">
                        <Save className="w-4 h-4 mr-2" /> {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>

            {/* SEO Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">SEO Settings</h2>
                <div className="grid gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">Meta Title</label>
                        <input 
                            type="text" 
                            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg dark:text-white"
                            value={data.seo.metaTitle}
                            onChange={(e) => setData({...data, seo: {...data.seo, metaTitle: e.target.value}})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">Meta Description</label>
                        <textarea 
                            rows="2"
                            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg dark:text-white"
                            value={data.seo.metaDescription}
                            onChange={(e) => setData({...data, seo: {...data.seo, metaDescription: e.target.value}})}
                        />
                    </div>
                </div>
            </div>

            {/* Dynamic Content Sections */}
            {config.sections.map(section => (
                <div key={section.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 border-b pb-2 border-gray-100 dark:border-gray-700">{section.title}</h2>
                    <div className="grid gap-6">
                        {section.fields.map(field => (
                            <div key={field.key}>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
                                    {field.label}
                                </label>
                                
                                {field.type === 'richtext' ? (
                                    <div className="dark:text-black">
                                        <JoditEditor
                                            value={data.content[section.id]?.[field.key] || ''}
                                            onBlur={newContent => updateContent(section.id, field.key, newContent)}
                                        />
                                    </div>
                                ) : field.type === 'textarea' ? (
                                    <textarea
                                        rows="3"
                                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg dark:text-white focus:ring-2 focus:ring-secondary outline-none"
                                        value={data.content[section.id]?.[field.key] || ''}
                                        onChange={(e) => updateContent(section.id, field.key, e.target.value)}
                                    />
                                ) : (
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg dark:text-white focus:ring-2 focus:ring-secondary outline-none"
                                        value={data.content[section.id]?.[field.key] || ''}
                                        onChange={(e) => updateContent(section.id, field.key, e.target.value)}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </form>
    );
};

export default AdminPageEditor;

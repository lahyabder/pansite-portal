import type { SiteSettings } from '../types';
import { getSupabaseAdmin } from '../supabase';

function mapToSettings(row: any): SiteSettings {
    return {
        id: row.id,
        siteName: row.site_name,
        logo: row.logo,
        logoFooter: row.logo_footer,
        favicon: row.favicon,
        slogan: row.slogan,
        contactEmails: row.contact_emails || [],
        contactPhones: row.contact_phones || [],
        address: row.address || {},
        socialLinks: row.social_links || {},
        coordinates: row.coordinates || {},
        copyright: row.copyright,
        seoGlobal: row.seo_global || {},
        updatedAt: row.updated_at,
    };
}

function mapToRow(settings: Partial<SiteSettings>) {
    const row: any = {};
    if (settings.siteName !== undefined) row.site_name = settings.siteName;
    if (settings.logo !== undefined) row.logo = settings.logo;
    if (settings.logoFooter !== undefined) row.logo_footer = settings.logoFooter;
    if (settings.favicon !== undefined) row.favicon = settings.favicon;
    if (settings.slogan !== undefined) row.slogan = settings.slogan;
    if (settings.contactEmails !== undefined) row.contact_emails = settings.contactEmails;
    if (settings.contactPhones !== undefined) row.contact_phones = settings.contactPhones;
    if (settings.address !== undefined) row.address = settings.address;
    if (settings.socialLinks !== undefined) row.social_links = settings.socialLinks;
    if (settings.coordinates !== undefined) row.coordinates = settings.coordinates;
    if (settings.copyright !== undefined) row.copyright = settings.copyright;
    if (settings.seoGlobal !== undefined) row.seo_global = settings.seoGlobal;
    row.updated_at = new Date().toISOString();
    return row;
}

export async function getSiteSettings(): Promise<SiteSettings | undefined> {
    const { data, error } = await getSupabaseAdmin()
        .from('settings')
        .select('*')
        .limit(1)
        .maybeSingle();

    if (error) throw error;
    return data ? mapToSettings(data) : undefined;
}

export async function updateSiteSettings(data: Partial<SiteSettings>): Promise<SiteSettings> {
    const current = await getSiteSettings();
    const row = mapToRow(data);

    if (!current) {
        // Initial insert
        const { data: inserted, error } = await getSupabaseAdmin()
            .from('settings')
            .insert([row])
            .select()
            .single();
        if (error) throw error;
        return mapToSettings(inserted);
    } else {
        // Update existing
        const { data: updated, error } = await getSupabaseAdmin()
            .from('settings')
            .update(row)
            .eq('id', current.id)
            .select()
            .single();
        if (error) throw error;
        return mapToSettings(updated);
    }
}

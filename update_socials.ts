import { getSiteSettings, updateSiteSettings } from './packages/shared/src/repository/settings';

async function run() {
    console.log('Fetching settings...');
    const settings = await getSiteSettings();
    const currentSocials = settings?.socialLinks || {};
    
    console.log('Current socials:', currentSocials);
    
    const newSocials = {
        ...currentSocials,
        facebook: 'https://www.facebook.com/panndb/?_rdc=1&_rdr#',
    };
    
    console.log('Updating settings to:', newSocials);
    
    await updateSiteSettings({ socialLinks: newSocials });
    console.log('Update complete.');
}

run().catch(console.error);

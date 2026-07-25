import re

with open('apps/admin/src/app/actions.ts', 'r') as f:
    content = f.read()

# Add imports and auth helpers
imports_to_add = """import { createClient } from '@/utils/supabase/server';

async function checkAuth() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");
    return user;
}

async function checkAdminAuth() {
    const user = await checkAuth();
    if (user.user_metadata?.role !== 'admin') throw new Error("Unauthorized: admin role required");
    return user;
}
"""

content = content.replace("import OpenAI from 'openai';", "import OpenAI from 'openai';\n\n" + imports_to_add)

# Functions that need admin check
admin_funcs = ['listUsersAction', 'createEditorUserAction', 'deleteUserAction', 'updateUserRoleAction', 'updateSettingsAction', 'createMenuAction', 'updateMenuAction']

# Functions that need regular auth check
auth_funcs = ['getAllPagesAction', 'getPageByIdAction', 'createPageAction', 'updatePageAction', 'deleteContentAction', 'deletePageAction', 'getAllMediaAction', 'deleteMediaAction', 'uploadAssetAction', 'getMediaUploadUrlAction', 'saveMediaMetadataAction', 'getSettingsAction', 'getMenuAction', 'translateContentAction', 'translateFullContentAction']

for func in admin_funcs:
    content = re.sub(rf'(export async function {func}\([^)]*\)\s*{{)', r'\1\n    await checkAdminAuth();\n', content)

for func in auth_funcs:
    content = re.sub(rf'(export async function {func}\([^)]*\)\s*{{)', r'\1\n    await checkAuth();\n', content)

with open('apps/admin/src/app/actions.ts', 'w') as f:
    f.write(content)

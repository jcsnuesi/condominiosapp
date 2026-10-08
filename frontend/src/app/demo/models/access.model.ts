export type ScopeMode = 'ALL' | 'SELECTED';

export interface AccessPolicy {
    _id: string;
    name: string;
    description: string;
    permissions: string[];
    excludedModules?: string[];
    isSystem: boolean;
    status: 'active' | 'archived';
}

export interface AccessScope {
    mode: ScopeMode;
    condominiumIds: string[];
}

export interface AccessContext {
    organization: { id: string; name: string; status: string } | null;
    isOwnerAdmin: boolean;
    isPlatform?: boolean;
    mfaPending?: boolean;
    contextType?: string;
    onboardingRequired?: boolean;
    permissions: string[];
    scope: AccessScope;
}

export interface AccessGrant {
    _id?: string;
    policyIds: Array<string | Pick<AccessPolicy, '_id' | 'name' | 'status'>>;
    overrides: { allow: string[]; deny: string[] };
    scope: AccessScope;
}

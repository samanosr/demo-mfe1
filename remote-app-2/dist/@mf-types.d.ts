
    export type RemoteKeys = 'REMOTE_ALIAS_IDENTIFIER/UserStats' | 'REMOTE_ALIAS_IDENTIFIER/AnalyticsDashboard';
    type PackageType<T> = T extends 'REMOTE_ALIAS_IDENTIFIER/AnalyticsDashboard' ? typeof import('REMOTE_ALIAS_IDENTIFIER/AnalyticsDashboard') :T extends 'REMOTE_ALIAS_IDENTIFIER/UserStats' ? typeof import('REMOTE_ALIAS_IDENTIFIER/UserStats') :any;
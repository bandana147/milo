// eslint-disable-next-line import/prefer-default-export
export const mockActionsdata = {
  projectStatus: { projectStatusText: 'test123', fetched: true, ja: { status: 'translated' }, jp: { status: 'translated' } },
  languages: {
    Language: 'Japanese',
    Action: 'Translate',
    Locales: 'jp',
    Workflow: 'Standard',
    locales: [
      'jp',
    ],
    localeCode: 'ja',
  },
  siteConfig: { locales: { data: [{ languagecode: 'ja', altLanguagecode: 'jp' }] } },
  buttonStatus: { start: { loading: true }, rollout: { loading: true } },
  token: 'Mock Token',
};

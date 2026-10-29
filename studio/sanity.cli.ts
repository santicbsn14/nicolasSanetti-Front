import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: '6j2h7mq3',
    dataset: 'production'
  },
  studioHost: 'nicolas-sanetti',
  deployment: {
    appId: 's7v6xrclshx5f78z5baoat6c',
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
  },
})

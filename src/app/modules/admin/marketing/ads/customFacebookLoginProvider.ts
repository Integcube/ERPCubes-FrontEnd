import { FacebookLoginProvider, SocialUser } from "@abacritt/angularx-social-login";

export class CustomFacebookLoginProvider extends FacebookLoginProvider {
    constructor(clientId: string) {
      super(clientId);
    }
  
    signIn(signInOptions?: any): Promise<SocialUser> {
      const options = {
        ...signInOptions,
        scope: 'ads_management,pages_manage_ads,leads_retrieval,pages_manage_ads,read_insights,pages_show_list,ads_read,business_management,pages_read_engagement,instagram_basic,pages_manage_metadata'
      };
      return super.signIn(options);
    }
  }
<?php
defined('ABSPATH') || die();
/** @var $this NextendSocialProviderAdmin */

$provider = $this->getProvider();
?>
<div class="nsl-admin-sub-content">

    <?php if (substr($provider->getLoginUrl(), 0, 8) !== 'https://'): ?>
        <div class="error">
            <p><?php printf(__('%1$s allows HTTPS OAuth Redirects only. You must move your site to HTTPS in order to allow login with %1$s.', 'nextend-facebook-connect'), 'Facebook'); ?></p>
            <p>
                <a href="https://nextendweb.com/nextend-social-login-docs/facebook-api-changes/#enforce-https" target="_blank"><?php _e('How to get SSL for my WordPress site?', 'nextend-facebook-connect'); ?></a>
            </p>
        </div>
    <?php else: ?>
        <h2 class="title"><?php _e('Getting Started', 'nextend-facebook-connect'); ?></h2>

        <p style="max-width:55em;"><?php printf(__('To allow your visitors to log in with their %1$s account, first you must create a %1$s App. The following guide will help you through the %1$s App creation process. After you have created your %1$s App, head over to "Settings" and configure the given "%2$s" and "%3$s" according to your %1$s App.', 'nextend-facebook-connect'), "Facebook", "App ID", "App secret"); ?></p>

        <h2 class="title"><?php printf(_x('Create %s', 'App creation', 'nextend-facebook-connect'), 'Facebook App'); ?></h2>

        <ol>
            <li><?php printf(__('Navigate to %s', 'nextend-facebook-connect'), '<a href="https://developers.facebook.com/apps/" target="_blank">https://developers.facebook.com/apps/</a>'); ?></li>
            <li><?php printf(__('Log in with your %s credentials if you are not logged in', 'nextend-facebook-connect'), 'Facebook'); ?></li>
            <li><?php _e('Click on the "<b>Add a New App" button</b>', 'nextend-facebook-connect'); ?></li>
            <li><?php _e('If you see the message "<b>Become a Facebook Developer</b>", then you need to click on the green "<b>Register Now</b>" button, fill the form then finally verify your account.', 'nextend-facebook-connect'); ?></li>
            <li><?php printf(__('Fill "<b>Display Name</b>" and "<b>Contact Email</b>". The specified "Display Name" will appear on your %s!', 'nextend-facebook-connect'), '<a href="https://developers.facebook.com/docs/facebook-login/permissions/overview/" target="_blank">Consent Screen</a>'); ?></li>
            <li><?php _e('Click the "<b>Create App ID</b>" button and complete the Security Check.', 'nextend-facebook-connect'); ?></li>
            <li><?php printf(__('On the left side, click on the “<b>%1$s</b>” menu point, then click “<b>%2$s</b>”.', 'nextend-facebook-connect'), 'Settings', 'Basic') ?></li>
            <li><?php _e('Enter your domain name to the "App Domains" field.', 'nextend-facebook-connect'); ?></li>
            <li><?php printf(__('Enter your domain name to the "<b>App Domains</b>" field, probably: <b>%s</b>', 'nextend-facebook-connect'), str_replace('www.', '', $_SERVER['HTTP_HOST'])); ?></li>
            <li><?php _e('Fill up the "<b>Privacy Policy URL</b>" field. Provide a publicly available and easily accessible privacy policy that explains what data you are collecting and how you will use that data.', 'nextend-facebook-connect'); ?></li>
            <li><?php _e('Select a “<b>Category</b>”, an “<b>App Icon</b>” and pick the “<b>Business Use</b>” option that describes your the App best, then press "<b>Save Changes</b>".', 'nextend-facebook-connect'); ?></li>
            <li><?php printf(__('On the left side, click on the “<b>%1$s</b>” menu point, then click “<b>%2$s</b>”.', 'nextend-facebook-connect'), 'Facebook Login', 'Settings') ?></li>
            <li><?php printf(__('Add the following URL to the "<b>Valid OAuth redirect URIs</b>" field: <b>%s</b>', 'nextend-facebook-connect'), $provider->getLoginUrl()); ?></li>
            <li><?php _e('Click on “<b>Save Changes</b>”', 'nextend-facebook-connect'); ?></li>
            <li><?php _e('Your application is currently private, which means that only you can log in with it. In the top bar click on the switch next to the "<b>In development</b>" label, then click the "<b>Switch Mode</b>" button.', 'nextend-facebook-connect'); ?></li>
            <li><?php printf(__('Finally on the left side, click on the "<b>%1$s</b>" menu point, then click "<b>%2$s</b>" again. Here you can see your "<b>APP ID</b>" and you can see your "<b>App secret</b>" if you click on the "Show" button. These will be needed in plugin’s settings.', 'nextend-facebook-connect'), 'Settings', 'Basic') ?></li>
        </ol>

        <a href="<?php echo $this->getUrl('settings'); ?>"
           class="button button-primary"><?php printf(__('I am done setting up my %s', 'nextend-facebook-connect'), 'Facebook App'); ?></a>

        <br>
        <div class="nsl-admin-embed-youtube">
            <div></div>
            <iframe src="https://www.youtube.com/embed/7iiIe8RLIAM?rel=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
        </div>
    <?php endif; ?>
</div>
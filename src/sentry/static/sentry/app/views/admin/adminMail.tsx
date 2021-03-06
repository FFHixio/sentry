import React from 'react';

import {addSuccessMessage, addErrorMessage} from 'app/actionCreators/indicator';
import {t} from 'app/locale';
import AsyncView from 'app/views/asyncView';
import Button from 'app/components/button';

type Data = {
  mailHost: string;
  mailPassword: string;
  mailUsername: string;
  mailPort: string;
  mailUseTls: string;
  mailFrom: string;
  mailListNamespace: string;
  testMailEmail: string;
};

type State = AsyncView['state'] & {data: Data};

export default class AdminMail extends AsyncView<{}, State> {
  getEndpoints(): ReturnType<AsyncView['getEndpoints']> {
    return [['data', '/internal/mail/']];
  }

  sendTestEmail = async () => {
    const testMailEmail = this.state.data.testMailEmail;

    try {
      await this.api.requestPromise('/internal/mail/', {method: 'POST'});
      addSuccessMessage(t('A test email has been sent to %s', testMailEmail));
    } catch (error) {
      addErrorMessage(
        error.responseJSON
          ? error.responseJSON.error
          : t('Unable to send test email. Check your server logs')
      );
    }
  };

  renderBody() {
    const {data} = this.state;
    const {
      mailHost,
      mailPassword,
      mailUsername,
      mailPort,
      mailUseTls,
      mailFrom,
      mailListNamespace,
      testMailEmail,
    } = data;

    return (
      <div>
        <h3>{t('SMTP Settings')}</h3>

        <dl className="vars">
          <dt>{t('From Address')}</dt>
          <dd>
            <pre className="val">{mailFrom}</pre>
          </dd>

          <dt>{t('Host')}</dt>
          <dd>
            <pre className="val">
              {mailHost}:{mailPort}
            </pre>
          </dd>

          <dt>{t('Username')}</dt>
          <dd>
            <pre className="val">{mailUsername || <em>{t('not set')}</em>}</pre>
          </dd>

          <dt>{t('Password')}</dt>
          <dd>
            <pre className="val">
              {mailPassword ? '********' : <em>{t('not set')}</em>}
            </pre>
          </dd>

          <dt>{t('TLS?')}</dt>
          <dd>
            <pre className="val">{mailUseTls ? t('Yes') : t('No')}</pre>
          </dd>

          <dt>{t('Mailing List Namespace')}</dt>
          <dd>
            <pre className="val">{mailListNamespace}</pre>
          </dd>
        </dl>

        <h3>{t('Test Settings')}</h3>

        <p>
          {t(
            "Send an email to your account's email address to confirm that everything is configured correctly."
          )}
        </p>

        <Button onClick={this.sendTestEmail}>
          {t('Send a test email to %s', testMailEmail)}
        </Button>
      </div>
    );
  }
}

// @flow

import classnames from "classnames";
// $FlowFixMe: Flow says withLocation isn't a named export, but we can still import it
import { Localized, withLocalization } from "fluent-react/compat";
import React from "react";

import LocalizedHtml from "../LocalizedHtml";

import { defaultState } from "../../reducers/newsletter-form";

import "./index.scss";

type NewsletterFormProps = {
  email?: string,
  privacy?: boolean,
  isModal?: boolean,
  subscribe?: Function,
  setEmail?: Function,
  buttonRef?: Function
}

// HACK: #3631 - avoid an error with <Localized> by using withLocalization and
// a hacked string from generateMessages in App container
const EmailField = withLocalization(({ value, onChange, getString }) => (
  <input
    ref={el => {
      if (el) {
        el.setAttribute(
          "placeholder",
          getString("newsletterFormEmailPlaceholderHackedString")
        );
      }
    }}
    {...{ value, onChange }}
    type='email'
    placeholder="Your email here"
    required
  />
));

export default class NewsletterForm extends React.Component {
  props: NewsletterFormProps
  handleEmailChange: Function
  handleSubmit: Function

  static defaultProps = defaultState();

  constructor(props: NewsletterFormProps) {
    super(props);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  makeRevealedClassNames() {
    return classnames("revealed-field", {
      reveal: !!this.props.email
    });
  }

  handleEmailChange(evt: Object) {
    if (typeof this.props.setEmail !== "undefined") {
      this.props.setEmail(evt.target.value);
    }
  }

  renderEmailField() {
    return (
      <EmailField value={this.props.email} onChange={this.handleEmailChange} />
    );
  }

  renderPrivacyField() {
    const fieldName = "privacy";
    const privacy = <Localized id="newsletterFormPrivacyNoticePrivacyLink">
      <a target="_blank" rel="noopener noreferrer"
        href="/privacy"/>
    </Localized>;

    return <div>
      <label className={this.makeRevealedClassNames()} htmlFor={fieldName}>
        <input name={fieldName} id={fieldName} type="checkbox" required />
        <LocalizedHtml id="newsletterFormPrivacyNotice" $privacy={privacy}>
          <span>
            I&apos;m okay with Mozilla handling my info as explained in {privacy}.
          </span>
        </LocalizedHtml>
      </label>
    </div>;
  }

  renderSubmitButton() {
    if (this.props.submitting) {
      return (
        <Localized id='newsletterFormSubmitButtonSubmitting'>
          <button disabled={true} className="button outline large newsletter-form-submitting">
            Submitting...
          </button>
        </Localized>
      );
    }
    return <Localized id='newsletterFormSubmitButton'>
      <button className={classnames("button", "large", this.props.isModal ? "default" : "outline")}
        ref={this.props.buttonRef}>Sign Up Now</button>
    </Localized>;
  }

  renderDisclaimer() {
    return (
      <Localized id='newsletterFormDisclaimer'>
        <p className="disclaimer">
          We will only send you Test Pilot-related information.
        </p>
      </Localized>
    );
  }

  handleSubmit(evt: Object) {
    evt.preventDefault();
    if (typeof this.props.subscribe !== "undefined") {
      this.props.subscribe(this.props.email);
    }
  }

  render() {
    return (
      <form className={ classnames("newsletter-form", { "newsletter-form-modal": this.props.isModal }) }
        onSubmit={this.handleSubmit} data-no-csrf>
        {this.renderEmailField()}
        {this.renderPrivacyField()}
        {this.renderSubmitButton()}
        {this.renderDisclaimer()}
      </form>
    );
  }
}

// @flow

import React from "react";
import { FluentDateTime } from "fluent/compat";
import { Localized } from "fluent-react/compat";
import { experimentL10nId } from "../../lib/utils";
import MeasurementsSection from "../../components/Measurements";
import ExperimentControls from "./ExperimentControls";

import type {
  DetailsOverviewType,
  LaunchStatusType,
  StatsSectionType,
  ContributorsSectionType
} from "./types";

export default function DetailsOverview({
  isMinFirefox,
  sendToGA,
  userAgent,
  hasAddon,
  isDisabling,
  isEnabling,
  enabled,
  graduated,
  experiment,
  pre_feedback_copy,
  installExperiment,
  doShowEolDialog,
  doShowPreFeedbackDialog,
  uninstallExperimentWithSurvey,
  highlightMeasurementPanel,
  flashMeasurementPanel,
  doShowTourDialog,
  doShowMobileAppDialog,
  surveyURL,
  hasTour
}: DetailsOverviewType) {
  const l10nId = (pieces: string) => experimentL10nId(experiment, pieces);

  return (
    <div className="details-overview">
      <div>
        <div>
          <ExperimentControls
            {...{
              isMinFirefox,
              sendToGA,
              hasAddon,
              userAgent,
              experiment,
              graduated,
              enabled,
              installExperiment,
              isEnabling,
              isDisabling,
              pre_feedback_copy,
              doShowEolDialog,
              doShowPreFeedbackDialog,
              flashMeasurementPanel,
              uninstallExperimentWithSurvey,
              surveyURL,
              doShowMobileAppDialog,
              hasTour
            }}
          />
        </div>
      </div>
      <div className="details-sections">
        <section className="user-count">
          <LaunchStatus {...{ experiment, graduated }} />
        </section>
        {!graduated && <StatsSection {...{ experiment, doShowTourDialog, flashMeasurementPanel, sendToGA, hasTour, isMinFirefox }} />}
        <ContributorsSection {...{ experiment, l10nId }} />
        {!graduated &&
          <MeasurementsSection
            {...{ experiment, highlightMeasurementPanel, l10nId }}
          />}
      </div>
    </div>
  );
}

export const LaunchStatus = ({ experiment, graduated }: LaunchStatusType) => {
  const { created, completed } = experiment;

  const completedDate = new FluentDateTime(completed, {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  if (graduated) {
    return (
      <Localized id="completedDate" $completedDate={completedDate} b={<b></b>}>
        <span>
          Experiment End Date: <b>{completed}</b>
        </span>
      </Localized>
    );
  }

  const startedDate = new FluentDateTime(created, {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  return (
    <Localized id="startedDate" $startedDate={startedDate} b={<b></b>}>
      <span>
        Experiment Start Date: <b>{created}</b>
      </span>
    </Localized>
  );
};

export const StatsSection = ({
  doShowTourDialog,
  flashMeasurementPanel,
  experiment: {
    title,
    web_url,
    platforms,
    changelog_url,
    contribute_url,
    bug_report_url,
    discourse_url
  },
  sendToGA,
  hasTour,
  isMinFirefox
}: StatsSectionType) => {

  const highlightPrivacy = () => {
    document.querySelectorAll(".measurements").forEach(el => {
      if (el.offsetTop) {
        window.scrollTo(0, el.offsetTop);
      }
    });
    flashMeasurementPanel();
  };

  return <section className="stats-section">
    <ul>
      {!web_url && hasTour &&
          <li>
            <Localized id="tourLink">
              <a className="showTour" onClick={evt => {
                sendToGA("event", {
                  eventCategory: "ExperimentDetailsPage Interactions",
                  eventAction: "button click",
                  eventLabel: "take tour"
                });
                doShowTourDialog(evt);
              }} href="#">
                Launch Tour
              </a>
            </Localized>
          </li>}
      {changelog_url &&
          <li>
            <a href={changelog_url}>
              <Localized id="changelog"><span>Changelog</span></Localized>
            </a>
          </li>}
      {contribute_url &&
          <li>
            <a href={contribute_url}>
              <Localized id="contribute"><span>Contribute</span></Localized>
            </a>
          </li>
      }
      <li>
        <a href={bug_report_url}>
          <Localized id="bugReports"><span>Bug Reports</span></Localized>
        </a>
      </li>
      <li>
        <a href={discourse_url}>
          <Localized id="discussExperiment" $title={title}>
            <span>Discuss {title}</span>
          </Localized>
        </a>
      </li>
      {!isMinFirefox && !platforms.includes("web") &&
        !platforms.includes("ios") && !platforms.includes("android") &&
        <li>
          <a onClick={highlightPrivacy}>
            <Localized id="highlightPrivacy"><span>Your privacy</span></Localized>
          </a>
        </li>
      }
    </ul>
  </section>;
};

export const ContributorsSection = ({
  experiment: { contributors, contributors_extra, contributors_extra_url },
  l10nId
}: ContributorsSectionType) =>
  <section className="contributors-section">
    <Localized id="contributorsHeading">
      <h3>Brought to you by</h3>
    </Localized>
    <ul className="contributors">
      {contributors.map((contributor, idx) =>
        <li key={idx}>
          <img
            className="avatar"
            width="56"
            height="56"
            src={contributor.avatar}
          />
          <div className="contributor">
            <p className="name">
              {contributor.display_name}
            </p>
            {contributor.title &&
              <Localized id={l10nId(["contributors", idx, "title"])}>
                <p className="title">
                  {contributor.title}
                </p>
              </Localized>}
          </div>
        </li>
      )}
    </ul>
    {contributors_extra &&
      <p className="disclaimer">
        <Localized id={l10nId("contributors_extra")}>
          <span>
            {contributors_extra}
          </span>
        </Localized>
        {contributors_extra_url &&
          <span>
            &nbsp;
            <Localized id="contributorsExtraLearnMore">
              <a
                href={contributors_extra_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn more
              </a>
            </Localized>
            .
          </span>}
      </p>}
  </section>;

import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import { Helmet } from "react-helmet";
import * as serviceWorker from "./serviceWorkerRegistration";
import CookieConsent from "./components/CookieConsent";
import DiscordButton from "./components/DiscordButton";
import { getStoredItem, storeItem } from "./services";
import Routes from "./router";
import { usePageTracking } from "./page-tracking";
import "./css/style.min.css";

const CrafterApp = () => {
  const [t] = useTranslation();
  const history = useHistory();
  const [showChangeLanguageModal, setChangeLanguageModal] = useState(false);
  const [newUpdate, setUpdateModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [redirectTo, setRedirectTo] = useState(null);
  let showHideClassName = showChangeLanguageModal
    ? "modal d-block"
    : "modal d-none";
  let showUpdateModal = newUpdate ? "modal d-block" : "modal d-none";
  serviceWorker.register({
    onUpdate: () => {
      setUpdateModal(true);
    },
  });

  usePageTracking();

  let language = getStoredItem("i18nextLng");

  if (redirectTo != null) {
    history.push(redirectTo);
    setRedirectTo(null);
    setSearchText("");
  }

  return (
    <React.Fragment>
      <Helmet
        htmlAttributes={{
          lang: language ? language : "en",
        }}
      >
        <link
          rel="stylesheet"
          href={
            getStoredItem("darkmode") !== "false"
              ? "/css/darkly.min.css"
              : "/css/journal.min.css"
          }
        />
      </Helmet>
      <header>
        <div className="navbar navbar-expand-md navbar-dark bg-dark">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">
              <span>Stiletto</span>.live
              <img
                width="35"
                height="35"
                alt="Stiletto.live"
                className="align-top"
                src="/img/icon-01.png"
              />
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#navbar-main-menu"
              aria-controls="navbar-main-menu"
              aria-expanded="false"
              aria-label="Toggle Menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                viewBox="0 0 30 30"
                role="img"
                focusable="false"
              >
                <title>{t("Menu")}</title>
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeMiterlimit="10"
                  strokeWidth="2"
                  d="M4 7h22M4 15h22M4 23h22"
                ></path>
              </svg>
            </button>
            <div className="collapse navbar-collapse" id="navbar-main-menu">
              <ul
                className="navbar-nav mr-auto mb-2 mb-md-0"
                itemScope="itemscope"
                itemType="https://www.schema.org/SiteNavigationElement"
              >
                <li className="nav-item">
                  <Link itemProp="url" className="nav-link" to="/crafter">
                    <span itemProp="name">{t("Crafting")}</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    itemProp="url"
                    className="nav-link"
                    to={getStoredItem("token") != null ? "/maps" : "/map"}
                  >
                    <span itemProp="name">{t("Resource Maps")}</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link itemProp="url" className="nav-link" to="/clanlist">
                    <span itemProp="name">{t("Clan List")}</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link itemProp="url" className="nav-link" to="/trades">
                    <span itemProp="name"> {t("Trades")}</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link itemProp="url" className="nav-link" to="/wiki">
                    <span itemProp="name"> {t("Wiki")}</span>
                  </Link>
                </li>
              </ul>
              <div
                className="col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3"
                role="search"
              >
                <div className="input-group" itemProp="potentialAction">
                  <input
                    type="search"
                    className="form-control"
                    placeholder={t("Search items")}
                    aria-label={t("Search items")}
                    aria-describedby="search-addon"
                    itemProp="query-input"
                    name="search"
                    onChange={(e) => setSearchText(e.currentTarget.value)}
                    onKeyPress={(e) => {
                      let keyPress = e.key || e.keyCode;
                      if (keyPress === 13 || keyPress === "Enter") {
                        setRedirectTo("/wiki?s=" + searchText);
                      }
                    }}
                    value={searchText}
                  />
                  <div className="input-group-append">
                    <button
                      type="button"
                      className="btn btn-outline-info"
                      onClick={() => setRedirectTo("/wiki?s=" + searchText)}
                    >
                      <i className="fa fa-search"></i>
                    </button>
                  </div>
                </div>
              </div>
              <button
                className="btn btn-sm mr-2"
                onClick={() => {
                  setChangeLanguageModal(true);
                }}
              >
                <img
                  className="rounded"
                  width="39"
                  height="25"
                  src={getLanguageFlag(language)}
                  alt="Change language"
                />
              </button>
              <DiscordButton />
            </div>
          </div>
        </div>
      </header>
      <main role="main" className="flex-shrink-0">
        <div className="container-fluid pt-4">
          {Routes}
          <div className={showUpdateModal}>
            <div className="modal-dialog border border-success">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{t("New web update")}</h5>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => {
                      setUpdateModal(false);
                    }}
                  >
                    {t("Cancel")}
                  </button>
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={() => updateWeb()}
                  >
                    {t("Update")}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className={showHideClassName}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">{t("Change language")}</div>
                <div className="modal-body">
                  <div className="row text-center">
                    <div className="col-3">
                      <img
                        className="img-thumbnail"
                        src="/img/es.jpg"
                        alt="Spanish language"
                        onClick={() => switchLanguage("es")}
                      />
                      <p>{t("Spanish")}</p>
                    </div>
                    <div className="col-3">
                      <img
                        className="img-thumbnail"
                        src="/img/en.jpg"
                        alt="English language"
                        onClick={() => switchLanguage("en")}
                      />
                      <p>{t("English")}</p>
                    </div>
                    <div className="col-3">
                      <img
                        className="img-thumbnail"
                        src="/img/ru.jpg"
                        alt="Russian language"
                        onClick={() => switchLanguage("ru")}
                      />
                      <p>{t("Russian")}</p>
                    </div>
                    <div className="col-3">
                      <img
                        className="img-thumbnail"
                        src="/img/fr.jpg"
                        alt="French language"
                        onClick={() => switchLanguage("fr")}
                      />
                      <p>{t("French")}</p>
                    </div>
                    <div className="col-3">
                      <img
                        className="img-thumbnail"
                        src="/img/de.jpg"
                        alt="German language"
                        onClick={() => switchLanguage("de")}
                      />
                      <p>{t("German")}</p>
                    </div>
                    <div className="col-3">
                      <img
                        className="img-thumbnail"
                        src="/img/zh.jpg"
                        alt="Chinese Simplified language"
                        onClick={() => switchLanguage("zh")}
                      />
                      <p>{t("Chinese Simplified")}</p>
                    </div>
                    <div className="col-3">
                      <img
                        className="img-thumbnail"
                        src="/img/it.jpg"
                        alt="Italian language"
                        onClick={() => switchLanguage("it")}
                      />
                      <p>{t("Italian")}</p>
                    </div>
                    <div className="col-3">
                      <img
                        className="img-thumbnail"
                        src="/img/ja.jpg"
                        alt="Japanese language"
                        onClick={() => switchLanguage("ja")}
                      />
                      <p>{t("Japanese")}</p>
                    </div>
                    <div className="col-3">
                      <img
                        className="img-thumbnail"
                        src="/img/pl.jpg"
                        alt="Polish language"
                        onClick={() => switchLanguage("pl")}
                      />
                      <p>{t("Polish")}</p>
                    </div>
                    <div className="col-3">
                      <img
                        className="img-thumbnail"
                        src="/img/pt.jpg"
                        alt="Portuguese language"
                        onClick={() => switchLanguage("pt")}
                      />
                      <p>{t("Portuguese, Brazilian")}</p>
                    </div>
                    <div className="col-3">
                      <img
                        className="img-thumbnail"
                        src="/img/uk.jpg"
                        alt="Ukrainian language"
                        onClick={() => switchLanguage("uk")}
                      />
                      <p>{t("Ukrainian")}</p>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <p className="mr-auto">v4.4.2</p>
                  <button
                    className={
                      getStoredItem("darkmode") !== "true"
                        ? "btn btn-outline-secondary"
                        : "btn btn-outline-light"
                    }
                    onClick={() => {
                      setChangeLanguageModal(false);
                    }}
                  >
                    {t("Accept")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className="footer footer mt-auto">
        <div className="container-fluid py-3 bg-dark text-white">
          <div className="row">
            <div className="col-xl-10">
              © 2020-2022 Dm94Dani{" | "}{" "}
              <Link className="text-white" to="/privacy">
                {t("Privacy Policy")}
              </Link>{" "}
              {" | "}
              <a
                title="GitHub package.json version"
                href="https://github.com/dm94/stiletto-web"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  width="104"
                  height="20"
                  alt="GitHub package.json version"
                  src="https://img.shields.io/github/package-json/v/dm94/stiletto-web"
                />
              </a>
              {" | "}
              <a
                title="GitHub last commit"
                href="https://github.com/dm94/stiletto-web"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  width="140"
                  height="20"
                  alt="GitHub last commit"
                  src="https://img.shields.io/github/last-commit/dm94/stiletto-web"
                />
              </a>
              {" | "}
              <a
                title="Crowdin"
                target="_blank"
                rel="noopener noreferrer"
                href="https://crowdin.com/project/stiletto"
              >
                <img
                  width="94"
                  height="20"
                  alt="Crowdin translations"
                  src="https://badges.crowdin.net/stiletto/localized.svg"
                />
              </a>
              {" | "}
              {t(
                "This website uses utilities related to the game 'Last Oasis' but is not affiliated with"
              )}{" "}
              <a
                href="https://www.donkey.team/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Donkey Crew
              </a>
            </div>
            <div className="col-xl-2">{darkMode(t)}</div>
          </div>
        </div>
      </footer>
      <CookieConsent />
    </React.Fragment>
  );
};

function getLanguageFlag(lng) {
  const supportedLanguages = [
    "en",
    "es",
    "ru",
    "fr",
    "de",
    "it",
    "ja",
    "pl",
    "zh",
    "pt",
    "uk",
  ];
  if (lng != null) {
    const lngFound = supportedLanguages.find((l) => lng.includes(l));
    if (lngFound) {
      return "/img/" + lngFound + ".jpg";
    }
  }

  return "/img/en.jpg";
}

function updateWeb() {
  localStorage.removeItem("allItems");
  sessionStorage.removeItem("allItems");
  caches.keys().then(function (names) {
    for (let name of names) {
      caches.delete(name);
    }
  });
  window.location.reload();
}

function switchLanguage(lng) {
  storeItem("i18nextLng", lng);
  i18next.changeLanguage(lng);
}

function darkMode(t) {
  if (getStoredItem("darkmode") !== "false") {
    return (
      <button
        className="btn btn-sm btn-outline-light"
        onClick={() => {
          storeItem("darkmode", false);
          window.location.reload();
        }}
      >
        <i className="far fa-sun"></i> {t("Light Theme Mode")}
      </button>
    );
  } else {
    return (
      <button
        className="btn btn-sm btn-outline-light"
        onClick={() => {
          storeItem("darkmode", true);
          window.location.reload();
        }}
      >
        <i className="far fa-moon"></i> {t("Dark Theme Mode")}
      </button>
    );
  }
}

export default CrafterApp;

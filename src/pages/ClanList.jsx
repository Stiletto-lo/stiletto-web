import React, { Component } from "react";
import LoadingScreen from "../components/LoadingScreen";
import ClanListItem from "../components/ClanListItem";
import ModalMessage from "../components/ModalMessage";
import { withTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import Axios from "axios";

class ClanList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_discord_id: localStorage.getItem("discordid"),
      token: localStorage.getItem("token"),
      isLoaded: false,
      clans: null,
      redirect: false,
      error: null,
      showRequestModal: false,
      clanRequestId: 0,
      textAreaModelValue: "",
    };
  }

  componentDidMount() {
    Axios.get(process.env.REACT_APP_API_URL + "/clans")
      .then((response) => {
        if (response.status === 202) {
          this.setState({ clans: response.data, isLoaded: true });
        } else if (response.status === 503) {
          this.setState({
            error: "Error connecting to database",
          });
        }
      })
      .catch(() => {
        this.setState({ error: "Error when connecting to the API" });
      });
  }

  sendRequest = () => {
    const options = {
      method: "post",
      url:
        process.env.REACT_APP_API_URL +
        "/clans/" +
        this.state.clanRequestId +
        "/requests",
      params: {
        discordid: localStorage.getItem("discordid"),
        token: localStorage.getItem("token"),
        message: this.state.textAreaModelValue,
      },
    };

    Axios.request(options)
      .then((response) => {
        if (response.status === 405) {
          this.setState({
            error: "You already have a pending application to join a clan",
          });
        } else if (response.status === 503) {
          this.setState({
            error: "Error connecting to database",
          });
        } else if (response.status === 202) {
          this.setState({ redirect: true });
        }
      })
      .catch(() => {
        this.setState({ error: "Error when connecting to the API" });
      });
    this.setState({ showRequestModal: false, textAreaModelValue: "" });
  };

  list() {
    if (this.state.clans != null) {
      return this.state.clans.map((clan) => (
        <ClanListItem
          key={clan.clanid}
          clan={clan}
          onSendRequest={(id) =>
            this.setState({ clanRequestId: id, showRequestModal: true })
          }
        />
      ));
    }
  }

  clanList(t) {
    if (this.state.isLoaded) {
      return (
        <div className="table-responsive">
          <Helmet>
            <title>{t("Clan List")} - Stiletto</title>
            <meta name="description" content="List of clans" />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content="Clan List - Stiletto" />
            <meta name="twitter:description" content="List of clans" />
            <meta
              name="twitter:image"
              content="https://raw.githubusercontent.com/dm94/stiletto-web/master/design/timers.jpg"
            />
            <link
              rel="canonical"
              href={
                window.location.protocol
                  .concat("//")
                  .concat(window.location.hostname) +
                (window.location.port ? ":" + window.location.port : "") +
                "/clanlist"
              }
            />
          </Helmet>
          <table className="table">
            <thead className="thead-light">
              <tr>
                <th className="text-center" scope="col">
                  {t("Clan Name")}
                </th>
                <th className="text-center" scope="col">
                  {t("Leader")}
                </th>
                <th className="text-center" scope="col">
                  {t("Discord Invite Link")}
                </th>
                <th className="text-center" scope="col">
                  {t("Actions")}
                </th>
              </tr>
            </thead>
            <tbody>{this.list()}</tbody>
          </table>
        </div>
      );
    } else {
      return <LoadingScreen />;
    }
  }

  render() {
    const { t } = this.props;
    if (this.state.error) {
      return (
        <ModalMessage
          message={{
            isError: true,
            text: t(this.state.error),
            redirectPage: "/profile",
          }}
        />
      );
    } else if (this.state.redirect) {
      return (
        <ModalMessage
          message={{
            isError: false,
            text: t("Application to enter the clan sent"),
            redirectPage: "/profile",
          }}
        />
      );
    }
    if (
      localStorage.getItem("discordid") != null &&
      localStorage.getItem("token") != null
    ) {
      let showHideClassName = this.state.showRequestModal
        ? "modal d-block"
        : "modal d-none";
      return (
        <div>
          {this.clanList(t)}
          <div className={showHideClassName}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="sendRequest">
                    {t("Send request")}
                  </h5>
                </div>
                <div className="modal-body">
                  <div class="form-group">
                    <label for="modalTextArea">{t("Request message")}</label>
                    <textarea
                      class="form-control bg-light"
                      id="modalTextArea"
                      rows="3"
                      value={this.state.textAreaModelValue}
                      onChange={(evt) =>
                        this.setState({
                          textAreaModelValue: evt.target.value,
                        })
                      }
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => this.setState({ showRequestModal: false })}
                  >
                    {t("Cancel")}
                  </button>
                  <button
                    className="btn btn-success"
                    onClick={this.sendRequest}
                  >
                    {t("Send request")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return (
      <ModalMessage
        message={{
          isError: true,
          text: "Login to access this section",
          redirectPage: "/profile",
        }}
      />
    );
  }
}

export default withTranslation()(ClanList);

import React, { Component } from "react";
import {
  isSignInPending,
  loadUserData,
  Person,
  getFile,
  putFile,
  lookupProfile
} from "blockstack";
import ImageUploader from "react-images-upload";

const avatarFallbackImage =
  "https://s3.amazonaws.com/onename/avatar-placeholder.png";

export default class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      person: {
        name() {
          return "Anonymous";
        },
        avatarUrl() {
          return avatarFallbackImage;
        }
      },
      username: "",
      newStatus: "",
      statuses: [],
      statusIndex: 0,
      isLoading: false,
      pictures: [],
      newPicture: null,
      pictureIndex: 0,
      itemArray: []
    };

    this.onDrop = this.onDrop.bind(this);
  }

  onDrop(picture) {
    this.setState({
      pictures: this.state.pictures.concat(picture)
    });
  }

  render() {
    const { handleSignOut } = this.props;
    const { person } = this.state;
    const { username } = this.state;

    const Example = ({ data, name }) => (
      <img src={`data:image/jpeg;base64,${data}`} id={name} />
    );

    return !isSignInPending() && person ? (
      <div className="container">
        <div className="row">
          <div className="col-md-offset-3 col-md-6">
            <div className="col-md-12">
              <div className="avatar-section">
                <img
                  src={
                    person.avatarUrl()
                      ? person.avatarUrl()
                      : avatarFallbackImage
                  }
                  className="img-rounded avatar"
                  id="avatar-image"
                />
                <div className="username">
                  <h1>
                    <span id="heading-name">
                      {person.name() ? person.name() : "Nameless Person"}
                    </span>
                  </h1>
                  <span>{username}</span>
                  {this.isLocal() && (
                    <span>
                      &nbsp;|&nbsp;
                      <a onClick={handleSignOut.bind(this)}>(Logout)</a>
                    </span>
                  )}
                </div>
              </div>
            </div>
            {this.isLocal() && (
              <div className="new-status">
                <div className="col-md-12">
                  <textarea
                    className="input-status"
                    value={this.state.newStatus}
                    onChange={e => this.handleNewStatusChange(e)}
                    placeholder="What's on your mind?"
                  />
                </div>
                <div className="col-md-12 text-right">
                  <button
                    className="btn btn-primary btn-lg"
                    onClick={e => this.handleNewStatusSubmit(e)}
                  >
                    Submit
                  </button>
                </div>
                <input
                  type="file"
                  name="pic"
                  accept="image/*"
                  onChange={e => this.handleNewImageChange(e)}
                />
                <div className="col-md-12 text-right">
                  <button
                    className="btn btn-primary btn-lg"
                    onClick={e => this.handleNewImageSubmit(e)}
                  >
                    Image
                  </button>
                </div>
              </div>
            )}
            <div className="col-md-12 statuses" id="statuses">
              {this.state.isLoading && <span>Loading...</span>}
              {this.state.statuses.map(status => (
                <div className="status" key={status.id}>
                  {status.text}
                </div>
              ))}
              {this.state.pictures.map((item, index) => {
                return (
                  <div className="box" key={index}>
                    <div>
                      <img src={`data:image/jpeg;base64,${item.text}`} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    ) : null;
  }

  componentWillMount() {
    this.setState({
      person: new Person(loadUserData().profile),
      username: loadUserData().username
    });
  }

  componentDidMount() {
    this.fetchData();
  }

  handleNewStatusChange(event) {
    this.setState({ newStatus: event.target.value });
  }

  handleNewImageChange(event) {
    var files = event.target.files;
    var file = files[0];

    if (files && file) {
      var reader = new FileReader();

      reader.onload = function(readerEvt) {
        var binaryString = readerEvt.target.result;
        var binaryResult = btoa(binaryString);
        this.setState({ newPicture: binaryResult });
      }.bind(this);

      reader.readAsBinaryString(file);
    }
  }

  handleNewStatusSubmit(event) {
    this.saveNewStatus(this.state.newStatus);
    this.setState({
      newStatus: ""
    });
  }
  handleNewImageSubmit(event) {
    this.saveNewImage(this.state.newPicture);
    this.setState({
      newPicture: null
    });
  }
  saveNewImage(pictureText) {
    let pictures = this.state.pictures;

    let picture = {
      id: this.state.pictureIndex++,
      text: pictureText,
      created_at: Date.now()
    };

    const text = this.state.newPicture;
    //item.push({ text });
    //this.setState({ itemArray: item });

    pictures.unshift({ text });
    const options = { encrypt: false };
    putFile("picture.json", pictures, options).then(() => {
      this.setState({
        pictures: pictures
      });
    });
  }

  saveNewStatus(statusText) {
    let statuses = this.state.statuses;

    let status = {
      id: this.state.statusIndex++,
      text: statusText.trim(),
      created_at: Date.now()
    };

    statuses.unshift(status);
    const options = { encrypt: false };
    putFile("statuses.json", JSON.stringify(statuses), options).then(() => {
      this.setState({
        statuses: statuses
      });
    });
  }
  fetchData() {
    this.setState({ isLoading: true });
    if (this.isLocal()) {
      const options = { decrypt: false };
      getFile("statuses.json", options)
        .then(file => {
          var statuses = JSON.parse(file || "[]");
          this.setState({
            person: new Person(loadUserData().profile),
            username: loadUserData().username,
            statusIndex: statuses.length,
            statuses: statuses
          });
        })
        .finally(() => {
          this.setState({ isLoading: false });
        });
    } else {
      const username = this.props.match.params.username;

      lookupProfile(username)
        .then(profile => {
          this.setState({
            person: new Person(profile),
            username: username
          });
        })
        .catch(error => {
          console.log("could not resolve profile");
        });
      const options = { username: username, decrypt: false };
      getFile("statuses.json", options)
        .then(file => {
          var statuses = JSON.parse(file || "[]");
          this.setState({
            statusIndex: statuses.length,
            statuses: statuses
          });
        })
        .catch(error => {
          console.log("could not fetch statuses");
        })
        .finally(() => {
          this.setState({ isLoading: false });
        });
    }
  }

  //Check if viewing local user profile or other's profile
  isLocal() {
    return this.props.match.params.username ? false : true;
  }
}

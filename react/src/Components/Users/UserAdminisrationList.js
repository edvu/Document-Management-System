import React, {Component} from 'react';
import NewUserForm from "./NewUserForm";
import axios from "axios";

class UserAdminisrationList extends Component {
    state = {
        userBeingEdited: {}, // naudotojo, kuri siuo metu redaguojame, duomenys
        userlist: [], // masyvas visu surastu pagal paieska naudotoju
        searchField: '',
        usergroups: [],
        allgroups: []
    }

    handleChangeInput = (event) => this.setState({[event.target.name]: event.target.value});


    getFilteredUsers = (event) => {
        document.getElementById('userListTable').style.visibility = 'visible';
        event.preventDefault();
        axios({
            method: 'get',
            url: "/api/users/criteria",
            params: {
                criteria: this.state.searchField
            },
            headers: {"Accept": "application/json"}
        })

        // axios.get("/api/users/criteria", this.state.searchField)
            .then(response => {
                if (response.data.length > 0) {
                    this.setState({userlist: response.data});
                } else (window.alert("Pagal paieska nerasta "))
            })
            .catch(error => {
                console.log("Atsakymas is getFilteredUsers: " + error)
            });
    }



    addGroup = (event) => {
        var userID = this.state.userIdentifier;
        var newGroup = this.state.group;
        axios({
                method: 'put',
                url: '/api/usergroup/' + newGroup + '/add-person',
                params: {
                    userIdentifier: this.state.userIdentifier
                },
                headers: {'Content-Type': 'application/json;charset=utf-8'}
            }
        )

        // axios.put('/api/usergroup/' + newGroup + '/add-person', {userIdentifier:this.state.userIdentifier})
            .then(response => {
                this.getAllGroupsfromServer(userID);
                this.getAllUserGroups(userID);
            })
            .catch(error => {
                console.log("Error from addGroup - " + error)
            })
    }


    deleteUser = (user) => {
        axios.delete('/api/users/' + user.userIdentifier)
            .then(response => {
                this.setState(this.emptyState);
                window.alert("Vartotojas " + user.username + " (vartotojo identifikatorius " + user.userIdentifier + " ) ištrintas")
            })
            .catch(error => {
                console.log("Error from deleteUser - " + error)
            })

    }

    handleChangeUser = (user) => {
        this.setState({userBeingEdited: user});
        document.getElementById('editUserForm').style.visibility = 'visible';

    }
    handleChangeUserHide = (event) => {
        document.getElementById('editUserForm').style.visibility = 'hidden';
    }

    render() {
        return (
            <React.Fragment>
                <div className="container-fluid">
                    <h4 className="my-4" align="center">
                        Naudotojų administravimas 2.
                    </h4>


                    <div className="form-group col-md-8 my-5">
                        <label htmlFor="exampleFormControlInput1">Naudotojo paieška</label>
                        <div className="row">
                            <div className="col-md-8 input-group">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="basic-addon1">🔎</span>
                                </div>
                                <input className="form-control mr-sm-2" type="search"
                                       placeholder="Įveskite naudotojo vardą, pavardę arba registracijos vardą (username)"
                                       aria-label="Search" aria-describedby="basic-addon1"
                                       value={this.state.searchField}
                                       name="searchField"
                                       onChange={this.handleChangeInput}/>
                            </div>
                            <div className="col-md-2">
                                <button className="btn btn-info my-2 my-sm-0" type="submit"
                                        onClick={this.getFilteredUsers}>Ieškoti
                                </button>
                            </div>
                            <div className="col-md-2">
                                <button className="btn btn-outline-info my-2 my-sm-0 buttonXL" type="submit"
                                        onClick={() => {
                                            this.props.history.push("/user-registration")
                                        }}>Registruoti naują naudotoją
                                </button>
                            </div>
                        </div>
                    </div>


                    <table className="table table-bordered table-hover table-sm" id="userListTable"
                           style={{'visibility': 'hidden'}}>
                        <thead>
                        <th>Username</th>
                        <th>Vardas</th>
                        <th>Pavardė</th>
                        <th>Naudotojo&nbsp;grupės</th>
                        <th>Veiksmai</th>
                        </thead>
                        <tbody>
                        {this.state.userlist.map(user => (
                            <tr key={user.userIdentifier}>
                                <td>{user.username}</td>
                                <td>{user.firstname}</td>
                                <td>{user.lastname}</td>
                                <td>
                                    {user.userGroups.map((group,index) => <span>{group.title} {index<user.userGroups.length-1?'|':''} </span>)}
                                </td>
                                <td>
                                    <button className="btn btn-info btn-sm"
                                            onClick={() => this.handleChangeUser(user)}>Edit
                                    </button>
                                    <button className="btn btn-secondary btn-sm ml-2"
                                            onClick={() => this.deleteUser(user)}>Delete
                                    </button>
                                </td>


                            </tr>
                        ))}
                        <tr>
                        </tr>

                        </tbody>
                    </table>

                    {/*<button onClick={this.handleChangeUser}>Redaguoti</button>*/}
                    {/*<button onClick={this.handleChangeUserHide}>Paslėpti redagavimo forma</button>*/}

                    <div id="editUserForm" style={{'visibility': 'hidden'}}>
                        <NewUserForm editmode={true}

                                     userIdentifier={this.state.userBeingEdited.userIdentifier}
                                     firstname={this.state.userBeingEdited.firstname}
                                     lastname={this.state.userBeingEdited.lastname}
                                     username={this.state.userBeingEdited.username}

                        />
                    </div>

                </div>
            </React.Fragment>
        );
    }
}

/*{...this.state.userBeingEdited}*/

export default UserAdminisrationList;
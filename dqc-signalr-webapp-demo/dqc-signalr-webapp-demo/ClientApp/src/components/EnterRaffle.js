import React, { Component, Fragment } from 'react';
import * as signalR from '@aspnet/signalr';

const initialState = { id: "", entered: false, winner: false, lost: false, nrOfClients: 0, nrOfEntries: 0 };

export class EnterRaffle extends Component {
    displayName = EnterRaffle.name

    constructor(props) {
        super(props);
        this.state = initialState;
    }

    componentDidMount() {
        this.start();
    }

    start() {
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl('/raffle')
            .build();

        this.connection.start()
            .then(() => {
                console.log("Connected to raffle hub");
            })
            .catch((err) => {
                console.log(err);
                setTimeout(() => this.start(), 5000);
            });

        this.connection.on("congrats", (winningNumber) => {
            this.setState({ winner: this.state.id === winningNumber });
        });

        this.connection.on("lost", (winningNumber) => {
            this.setState({ lost: this.state.id !== winningNumber });
        });

        this.connection.on("clientsConnected", (nrOfClients) => {
            this.setState({ nrOfClients: nrOfClients });
        });

        this.connection.on("raffleEntries", (nrOfEntries) => {
            this.setState({ nrOfEntries: nrOfEntries });
        });

        this.connection.onclose(() => {
            this.start();
        });
    };

    render() {
        let body;
        if (!this.state.entered) {
            body = (<Fragment>
                    <h1 className="padding-bottom-1">Enter ticket number to enter raffle</h1>
                    <div className="row">
                        <div className="col-lg-8">
                            <div className="input-group input-group-lg">
                                <input type="text" className="form-control" name="ticketNumber" onChange={(e) => { this.setState({ id: e.target.value }); }} />
                                <span className="input-group-btn">
                                    <button className="btn btn-primary" onClick={() => {
                                    this.setState({ entered: true });
                                    // Ofcourse I want to enter the raffle, here take my ticket id.
                                        this.connection.invoke('enterRaffle', this.state.id);
                                    }} >Enter raffle</button>
                                </span>
                            </div>
                        </div>
                    </div>
                </Fragment>);
        }
        else if (this.state.winner) {
            body = (<Fragment>
                <div className="alert alert-success" role="alert">
                    <h1>WINNER</h1>
                </div>
            </Fragment>);
        }
        else if (this.state.lost) {
            body = (<Fragment>
                <div className="alert alert-warning" role="alert">
                    <h1>YOU LOST, Better luck next time.</h1>
                </div>
            </Fragment>);
        }
        else {
            body = (<Fragment>
                <div className="alert alert-info" role="alert">
                    <h1>You have entered the raffle, waiting for winner.</h1>
                </div>
            </Fragment>);
        }

        return (
            <Fragment>
                <div className="row">
                    {body}
                </div>
                <hr />
                <div className="row">
                    <div className="col-lg-4">
                        <h1 className="padding-bottom-1">Nr of Connected clients: {this.state.nrOfClients}</h1>
                    </div>
                    <div className="col-lg-4">
                        <h1 className="padding-bottom-1">Nr of raffle entries: {this.state.nrOfEntries}</h1>
                    </div>
                </div>
            </Fragment>
        );
    }
}
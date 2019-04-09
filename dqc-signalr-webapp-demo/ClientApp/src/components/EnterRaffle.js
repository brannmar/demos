import React, { Component, Fragment } from 'react';
import * as signalR from '@aspnet/signalr';

export class EnterRaffle extends Component {
    displayName = EnterRaffle.name

    constructor(props) {
        super(props);
        this.state = { id: "", entered: false, winner: false, lost: false };
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl('/raffle')
            .build();

        this.connection.start()
            .then(() => { console.log("Connected to raffle hub"); });

        this.connection.on("congrats", (winningNumber) => {
            this.setState({ winner: this.state.id === winningNumber });
        });

        this.connection.on("lost", (winningNumber) => {
            this.setState({ lost: this.state.id !== winningNumber });
        });
    }

    render() {
        if (!this.state.entered) {
            return (<Fragment>
                <h1>Enter ticket number to enter raffle</h1>
                <input type="text" name="ticketNumber" onChange={(e) => { this.setState({ id: e.target.value }); }} />
                <button onClick={() => {
                    this.setState({ entered: true });
                    this.connection.invoke('enterRaffle', this.state.id);
                }} >Enter raffle</button>
            </Fragment>);
        }
        else if (this.state.winner) {
            return (<Fragment><h1>WINNER</h1></Fragment>);
        }
        else if (this.state.lost) {
            return (<Fragment><h1>YOU LOST, Better luck next time.</h1></Fragment>);
        }
        else {
            return (<Fragment><h1>You have entered the raffle, waiting for winner.</h1></Fragment>);
        }
    }
}
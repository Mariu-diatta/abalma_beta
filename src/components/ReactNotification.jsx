import React, { Component } from 'react';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css'; // IMPORTANT : importer le CSS

class Example extends Component {
    handleNotification = (type) => {
        switch (type) {
            case 'info':
                NotificationManager.info('Voici une info.');
                break;
            case 'success':
                NotificationManager.success('Succès !', 'Bravo 🎉');
                break;
            case 'warning':
                NotificationManager.warning('Attention !', 'Ferme dans 3s', 3000);
                break;
            case 'error':
                NotificationManager.error('Une erreur est survenue', 'Clique ici !', 5000, () => {
                    alert('Callback exécuté !');
                });
                break;
            default:
                console.warn("Type de notification non reconnu :", type);
        }
    };

    render() {
        return (
            <div className="container mt-4">
                <h3>Notifications Demo</h3>
                <div className="d-flex flex-column gap-2 mt-3">
                    <button className="btn btn-info" onClick={() => this.handleNotification('info')}>
                        Info
                    </button>
                    <button className="btn btn-success" onClick={() => this.handleNotification('success')}>
                        Success
                    </button>
                    <button className="btn btn-warning" onClick={() => this.handleNotification('warning')}>
                        Warning
                    </button>
                    <button className="btn btn-danger" onClick={() => this.handleNotification('error')}>
                        Error
                    </button>
                </div>

                <NotificationContainer />
            </div>
        );
    }
}

export default Example;

import React, {Component} from "react";
import Modal from "react-bootstrap/Modal";

export class ModalForm extends Component<{ show: any, onHide: () => any }> {
    render() {
        return <Modal
            size="lg"
            show={this.props.show}
            onHide={this.props.onHide}
            aria-labelledby="example-modal-sizes-title-lg"
        >
            <Modal.Header closeButton>
                <Modal.Title id="example-modal-sizes-title-lg">
                    {this.props.title}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {this.props.children}
            </Modal.Body>
        </Modal>;
    }
}
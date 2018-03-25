import React, { Component } from 'react';
import { Container, Header, Form, Modal, Button, Icon } from 'semantic-ui-react';
import parseTree from './parse-tree';
import "./app.css";

const vizTypes = {
    TIDY_TREE: 'TIDY_TREE',
    RADIAL_TIDY_TREE: 'RADIAL_TIDY_TREE',
    COLLAPSIBLE_INDENTED_TREE: 'COLLAPSIBLE_INDENTED_TREE'
};

const vizTypeToUrlMap = {
    [vizTypes.TIDY_TREE]: '/visualizations/tidy-tree/index.html',
    [vizTypes.RADIAL_TIDY_TREE]: '/visualizations/radial-tidy-tree/index.html',
    [vizTypes.COLLAPSIBLE_INDENTED_TREE]: '/visualizations/indented-tree/index.html'
};

export default class App extends Component {
    state = {
        vizType: vizTypes.RADIAL_TIDY_TREE,
        isParsing: false, // used for loading spinner
        isModalOpen: false,
        modalMessage: ''
    };

    textareaContent = '';

    handleTextareaChange = (e) => {
        this.textareaContent = e.target.value;
    }

    handleVizTypeChange = (e, { value }) => this.setState({ vizType: value });

    showMessage(text) {
        this.setState({
            isModalOpen: true,
            modalMessage: text
        })
    }

    closeModal = () => this.setState({ isModalOpen: false, modalMessage: '' });

    renderModal = () => (
        <Modal
            open={this.state.isModalOpen}
            onClose={this.closeModal}
            basic
            size='small'>

            <Header icon='bolt' content='Oops!' />
            <Modal.Content>
                <h3>{this.state.modalMessage}</h3>
            </Modal.Content>
            <Modal.Actions>
                <Button color='green' onClick={this.closeModal} inverted>
                    <Icon name='checkmark' /> Got it
                </Button>
            </Modal.Actions>
        </Modal>
    );

    openNewTab(url, exposedMethodName) {
        return new Promise((resolve, reject) => {
            const newTab = window.open(url);

            if (!newTab) {
                throw new Error('Failed to open new tab.');
            }

            newTab.onload = () => {
                newTab.focus();
                resolve(newTab);
            };
        });
    }

    parseInputAndRenderTree = async (text) => {
        this.setState({isParsing: true});

        try {
            const tree = parseTree(text);
            const url = vizTypeToUrlMap[this.state.vizType];
            const newTab = await this.openNewTab(url, 'render');
            newTab.render(tree);
        }
        catch(e) {
            if (e instanceof SyntaxError) {
                this.showMessage(e.message);
            }
            else {
                this.showMessage('Something went wrong!');
                console.error(e.name, e.message);
            }
        }
        finally {
            this.setState({isParsing: false});
        }
    }

    handleSubmit = function() {
        const text = this.textareaContent;

        if (text.length === 0) {
            this.showMessage('You need to enter some text in order to visualize it.');
        }
        else {
            this.parseInputAndRenderTree(text);
        }
    }.bind(this);

    render() {
        const { vizType } = this.state;

        return (
            <Container className="app-container">
                <Header as='h2'>Tree visualization</Header>
                <p>Solution of the tech task for resin.io (to parse and visualize trees)</p>

                <Form loading={this.state.isParsing}>
                    <Form.Group inline>
                        <label>Type</label>
                        <Form.Radio
                            label='Tidy Tree'
                            value={vizTypes.TIDY_TREE}
                            checked={vizType === vizTypes.TIDY_TREE}
                            onChange={this.handleVizTypeChange} />
                        <Form.Radio
                            label='Radial Tidy Tree'
                            value={vizTypes.RADIAL_TIDY_TREE}
                            checked={vizType === vizTypes.RADIAL_TIDY_TREE}
                            onChange={this.handleVizTypeChange} />
                        <Form.Radio
                            label='Collapsible Indented Tree'
                            value={vizTypes.COLLAPSIBLE_INDENTED_TREE}
                            checked={vizType === vizTypes.COLLAPSIBLE_INDENTED_TREE}
                            onChange={this.handleVizTypeChange} />
                    </Form.Group>
                    <Form.TextArea
                        rows={17}
                        label='Text'
                        placeholder='Text to parse & visualize...'
                        onChange={this.handleTextareaChange} />
                    <Form.Button onClick={this.handleSubmit}>Visualize</Form.Button>
                </Form>
                {this.renderModal()}
            </Container>
        );
    }
}

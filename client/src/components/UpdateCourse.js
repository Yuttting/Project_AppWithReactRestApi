import React, { Component } from 'react';
import Form from './Form';
import config from '../config';

export default class CreateCourse extends Component {
    state = {
        title: '',
        description: '',
        estimatedTime: '',
        materialsNeeded: '',
        errors: [],
    }

    async componentDidMount() {
        const apiUrl = `${config.apiBaseUrl}/courses/${this.props.match.params.id}`;
        await fetch(apiUrl)
          .then((response) => response.json())
          .then((data) => {console.log(data);this.setState({
            title: data.title,
            description: data.description,
            estimatedTime: data.estimatedTime,
            materialsNeeded: data.materialsNeeded,
            })})
    }

    render() {
        const { context } = this.props;
        const {
            title,
            description,
            estimatedTime,
            materialsNeeded,
            errors
        } = this.state;

        console.log(title)

        return (
            <div className="bounds course--detail">
                <h1>Update Course</h1>
                <Form 
                    cancel={this.cancel}
                    errors={errors}
                    submit={this.submit}
                    submitButtonText="Update Course"
                    elements={() => (
                        <React.Fragment>
                            <div className="grid-66">
                                <div className="course--header">
                                    <h4 className="course--label">Course</h4>
                                    <input 
                                        id="title"
                                        name="title"
                                        type="text"
                                        value={title}
                                        onChange={this.change}
                                        placeholder="Course title..."
                                        className="input-title course--title--input" />
                                    <p>By {context.authenticatedUser.firstName} {context.authenticatedUser.lastName}</p>
                                </div>
                                    <textarea 
                                        id="description"
                                        name="description"
                                        type="text"
                                        value={description}
                                        onChange={this.change}
                                        placeholder="Course description..."
                                        className="course--description" />
                            </div>
                            <div className="grid-25 grid-right">
                                <div className="course--stats">
                                    <ul className="course--stats--list">
                                        <li className="course--stats--list--item">
                                            <h4>Estimated Time</h4>
                                            <input 
                                                id="estimatedTime"
                                                name='estimatedTime'
                                                type="text"
                                                value={estimatedTime}
                                                onChange={this.change}
                                                placeholder="Hours" 
                                                className="course--time--input" />
                                        </li>
                                        <li className="course--stats--list--item">
                                            <h4>Materials Needed</h4>
                                            <textarea 
                                                id="materialsNeeded"
                                                name="materialsNeeded"
                                                type="text"
                                                value={materialsNeeded}
                                                onChange={this.change}
                                                placeholder="List materials..." />
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </React.Fragment>
                    )} />
            </div>
        );
    }

    change = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        this.setState(() => {
            return {
                [name]: value
            };
        });
    };

    submit = () => {

    };

    cancel = () => {
        this.props.history.push('/');
    };
}
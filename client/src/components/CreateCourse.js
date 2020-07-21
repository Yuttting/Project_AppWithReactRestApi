// This component provides the "Create Course" screen 
// by rendering a form that allows a user to create a new course. 
// The component also renders a "Create Course" button that when clicked 
// sends a POST request to the REST API's /api/courses route. 
// This component also renders a "Cancel" button that returns the user 
// to the default route (i.e. the list of courses).

import React, { Component } from 'react';
import Form from './Form';
import Data from '../Data';

export default class CreateCourse extends Component {
    
    constructor() {
        super();
        this.data = new Data();
    }

    state = {
        title: '',
        description: '',
        estimatedTime: '',
        materialsNeeded: '',
        errors: [], 
    }

    render() {
        const { context } = this.props;
        const {
            title,
            description,
            estimatedTime,
            materialsNeeded,
            errors,
        } = this.state;


        return (
            <div className="bounds course--detail">
                <h1>Create Course</h1>
                <Form 
                    cancel={this.cancel}
                    errors={errors}
                    submit={this.submit}
                    submitButtonText="Create Course"
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
        const { context } = this.props;
        //const { from } = this.props.location.state || {from: {pathname: '/authenticated'}}
        //const { emailAddress, id } = context.authenticatedUser;
        const { emailAddress, password, id } = context.authenticatedUser;
        //const password = context.unhashedPass;
        const userId = id;
        const {
            title,
            description,
            estimatedTime,
            materialsNeeded,
        } = this.state;


        //create course
        const course = {
            title,
            description,
            estimatedTime,
            materialsNeeded,
            userId,
        } 

        context.data.createCourse(course, emailAddress, password)
            .then(errors => {
                if(errors && errors.length > 0) {
                  this.setState({ errors });
                } else {
                  this.props.history.push(`/`);
                }
              })
            .catch((err) => {
                console.error(err);
                this.props.history.push('/error');
            });
    };

    cancel = () => {
        this.props.history.push('/');
    };
}
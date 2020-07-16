import React, { Component } from 'react';
import Form from './Form';

export default class CreateCourse extends Component {
    state = {
        title: '',
        description: '',
        estimatedTime: '',
        materialsNeeded: '',
        errors: [],
    }

    async componentDidMount() {
        const { context } = this.props;
        context.data.getCourseDetail(this.props.match.params.id)
            .then(response => {
                this.setState({
                    title: response.title,
                    description: response.description,
                    estimatedTime: response.estimatedTime,
                    materialsNeeded: response.materialsNeeded,
                })
            })
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
                                                value={estimatedTime || "" }
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
                                                value={materialsNeeded || "" }
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
        const {emailAddress, id} = context.authenticatedUser;
        const password = context.unhashedPass;
        const userId = id;

        const {
            title,
            description,
            estimatedTime,
            materialsNeeded,
         } = this.state;

         const course = {
            title,
            description,
            estimatedTime,
            materialsNeeded,
            userId,
         }

         const courseId = this.props.match.params.id;
         context.data.updateCourse(courseId, course, emailAddress, password)
            .then (errors => {
                if (errors == null) {
                    this.setState({ errors: ['Title and Course description are required.']});
                }
                else if (errors && errors.length === 0) {
                    this.props.history.push(`/courses/${courseId}`); 
                } else {
                    this.props.history.push('/forbidden'); 
                }
              })
            .catch((err) => {
                console.log(err);
                this.props.history.push('/error')
            })
    };

    cancel = () => {
        this.props.history.push('/');
    };
}
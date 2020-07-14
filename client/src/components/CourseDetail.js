import React, { Component } from 'react';
import config from '../config';

export default class CourseDetail extends Component {
    state = {
        course: [],
    }

    async componentDidMount() {
        const apiUrl = `${config.apiBaseUrl}/${this.props.match.url}`;
        await fetch(apiUrl)
          .then((response) => response.json())
          .then((data) => {this.setState({course: data})})
        // const id = this.props.match.params.id;
        // await this.props.context.data.getCourseDetail(id) 
        //   .then((response) => {console.log(response);this.setState({course: response})})
            
    }

    render() {

        let arr;
        let material;
        if(this.state.course.materialsNeeded) {
            arr = this.state.course.materialsNeeded.split('*').filter(function(value){return value.length !== 0});
        }
        if(arr) {
            material = arr.map((item, index) => <li key={index}> {item} </li>);
        }

        let paragraph;
        let description;
        if(this.state.course.description) {
            paragraph = this.state.course.description.split('\n');
        }
        if(paragraph) {
            description = paragraph.map((p,index) => <span key={index}>{p}</span>)
        }
        
        return (
            <div>
            <div className="actions--bar">
                <div className="bounds">
                    <div className="grid-100">
                        <span>
                            <a className="button" href="update-course">Update Course</a>
                            {/* <a className="button" href="/">Delete Course</a> */}
                            <button className="button" onClick={this.delete}>Delete Course</button>
                        </span>
                            <a className="button button-secondary" href="/">Return to List</a></div>
                </div>
            </div>
            
            <div className="bounds course--detail">
                <div className="grid-66">
                    <div className="course--header">
                        <h4 className="course--label">Course</h4>
                        <h3 className="course--title">{this.state.course.title}</h3>
                        <p>By {this.state.course.User? this.state.course.User.firstName : ''} {this.state.course.User? this.state.course.User.lastName : ''}</p>
                    </div>
                    <div className="course--description">
                    <p>{description}</p>
                    </div>
                </div>
                <div className="grid-25 grid-right">
                    <div className="course--stats">
                        <ul className="course--stats--list">
                            <li className="course--stats--list--item">
                            <h4>Estimated Time</h4>
                            <h3>{this.state.course.estimatedTime}</h3>
                            </li>
                                <li className="course--stats--list--item">
                                <h4>Materials Needed</h4>
                                <ul>
                                    {material}
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            </div>
        )
    }

    delete = () => {
        const { context } = this.props;
        console.log(context)
        const id = this.props.match.params.id
        if (context.authenticatedUser){
            const { password, emailAddress } = context.authenticatedUser;
            context.data.deleteCourse(id, emailAddress, password)
                .then( errors => {
                    if (errors && errors.length > 0) {
                        this.setState({ errors });
                    } else {
                        this.props.history.push('/'); 
                    }
                  })
                .catch((err) => {
                console.log(err);
                this.props.history.push('/error');
                });
        } else {
            this.props.history.push('/authenticated'); 
        }
    }
}


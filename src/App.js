import React from 'react'
import { BrowserRouter as Router, Route, Link, Redirect } from 'react-router-dom'
import { Nav, Navbar, Table, Grid, Row, Col, FormGroup, ControlLabel, FormControl, Button, Alert } from 'react-bootstrap'
import image from "./Alan_Turing.jpg";
import RouteNavItem from "./components/RouteNavItem";


const Menu = () => (
  <div>
    <Navbar inverse collapseOnSelect>
      <Navbar.Header>
        <Navbar.Brand>
          <a href="/">Software Anecdotes</a>
        </Navbar.Brand>
      </Navbar.Header>
      <Navbar.Collapse>
        <Nav>
          <RouteNavItem eventKey={1} href="/">
            anecdotes
          </RouteNavItem>
          <RouteNavItem eventKey={2} href="/create">
            create new
          </RouteNavItem>
          <RouteNavItem eventKey={3} href="/about">
            about
          </RouteNavItem>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  </div>
)

const AnecdoteList = ({ anecdotes }) => (
  <div>
    <h2>Anecdotes</h2>
    <Table striped>
      <tbody>
        {anecdotes.map(anecdote =>
          <tr key={anecdote.id} >
            <td>
              <Link to={"/anecdotes/" + anecdote.id} >
                {anecdote.content}</Link>
            </td>
            <td>
              {anecdote.author}
            </td>
          </tr>)}
      </tbody>
    </Table>
  </div>
)

const AnecdoteItem = ({ anecdote }) => (
  <div>
    <h3>{anecdote.content} by {anecdote.author}</h3>
    <p>has {anecdote.votes} votes</p>
    <p>See more info: <a href={anecdote.info}>{anecdote.info}</a></p>
  </div>
)

const About = () => (
  <div>
    <h2>About anecdote app</h2>
    <Grid>
      <Row>
        <Col xs={12} md={8}>
          <p>According to Wikipedia:</p>

          <em>An anecdote is a brief, revealing account of an individual person or an incident.
            Occasionally humorous, anecdotes differ from jokes because their primary purpose is not simply to provoke laughter but to reveal a truth more general than the brief tale itself,
            such as to characterize a person by delineating a specific quirk or trait, to communicate an abstract idea about a person, place, or thing through the concrete details of a short narrative.
            An anecdote is "a story with a point."</em>

          <p>Software engineering is full of excellent anecdotes, at this app you can find the best and add more.</p>
        </Col>
        <Col xs={6} md={4}>
          <img src={image} width="100%" height="auto" alt="Alan Turing" />
        </Col>
      </Row>
    </Grid>
  </div>
)

const Footer = () => (
  <div>
    Anecdote app for <a href='https://courses.helsinki.fi/fi/TKT21009/121540749'>Full Stack -sovelluskehitys</a>.

    See <a href='https://github.com/mluukkai/routed-anecdotes'>https://github.com/mluukkai/routed-anecdotes</a> for the source code.
  </div>
)

class CreateNew extends React.Component {
  constructor() {
    super()
    this.state = {
      content: '',
      author: '',
      info: '',
      fireRedirect: false
    }
  }

  handleChange = (e) => {
    console.log(e.target.name, e.target.value)
    this.setState({ [e.target.name]: e.target.value })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.addNew({
      content: this.state.content,
      author: this.state.author,
      info: this.state.info,
      votes: 0
    })
    this.setState({ fireRedirect: true })

  }

  render() {
    //const { from } = this.props.location.state || '/'
    const { fireRedirect } = this.state
    return (
      <div>
        <h2>create a new anecdote</h2>
        <form onSubmit={this.handleSubmit}>
          <FormGroup>
            <ControlLabel>content</ControlLabel>
            <FormControl type="text" name="content"
              placeholder="Put your best anecdote here"
              defaultValue={this.state.content}
              onChange={this.handleChange} />
            <ControlLabel>author</ControlLabel>
            <FormControl type="text" name="author"
              placeholder="Who said the anecdote the first time?"
              defaultValue={this.state.author}
              onChange={this.handleChange} />
            <ControlLabel>url for more info</ControlLabel>
            <FormControl type="text" name="info"
              placeholder="Where can we find more info of this?"
              defaultValue={this.state.info}
              onChange={this.handleChange} />
            <Button bsStyle="success" type="submit">create</Button>
          </FormGroup>
        </form>
        {fireRedirect && (
          //<Redirect to={from || "/anecdotes"} />
          <Redirect to={"/"} />
        )}
      </div>
    )

  }
}

class App extends React.Component {
  constructor() {
    super()

    this.state = {
      anecdotes: [
        {
          content: 'If it hurts, do it more often',
          author: 'Jez Humble',
          info: 'https://martinfowler.com/bliki/FrequencyReducesDifficulty.html',
          votes: 0,
          id: '1'
        },
        {
          content: 'Premature optimization is the root of all evil',
          author: 'Donald Knuth',
          info: 'http://wiki.c2.com/?PrematureOptimization',
          votes: 0,
          id: '2'
        }
      ],
      message: '',
      notificationFlag: false
    }
  }

  addNew = (anecdote) => {
    anecdote.id = (Math.random() * 10000).toFixed(0)
    this.setState({
      anecdotes: this.state.anecdotes.concat(anecdote),
      message: "We knew you would succeed in this",
      notificationFlag: true
    })
    setTimeout(() => this.setState({ message: '', notificationFlag: false }), 10000)
  }

  anecdoteById = (id) =>
    this.state.anecdotes.find(a => a.id === id)

  vote = (id) => {
    const anecdote = this.anecdoteById(id)

    const voted = {
      ...anecdote,
      votes: anecdote.votes + 1
    }

    const anecdotes = this.state.anecdotes.map(a => a.id === id ? voted : a)

    this.setState({ anecdotes })
  }


  render() {
    const { notificationFlag } = this.state

    return (
      <div className="container">
        <Router>
          <div>
            <Menu />
            <div>
              {notificationFlag && <Alert color="success">{this.state.message}</Alert>}
              <Route exact path="/" render={() => <AnecdoteList anecdotes={this.state.anecdotes} />} />
              <Route exact path="/anecdotes/:id" render={({ match }) =>
                (<AnecdoteItem anecdote={this.anecdoteById(match.params.id)} />)} />
              <Route path="/about" render={() => <About />} />
              <Route path="/create" render={() => <CreateNew addNew={this.addNew} />} />
              <Footer />
            </div>
          </div>
        </Router>
      </div>
    );
  }
}

export default App;

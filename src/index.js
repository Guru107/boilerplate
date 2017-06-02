import React from 'react'
import { render } from 'react-dom'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import RaisedButton from 'material-ui/RaisedButton'

class App extends React.Component {
	render(){
		return(
			<MuiThemeProvider>
				<RaisedButton label="Default" />
			</MuiThemeProvider>
		)
	}
}



render(<App/>,document.getElementById('app'))

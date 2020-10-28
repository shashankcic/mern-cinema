import React, { Component, useState, useEffect } from 'react';
import ReactTable from 'react-table-6';
import api from '../api';

import styled from 'styled-components';

import 'react-table-6/react-table.css';

const Wrapper = styled.div`
	padding: 0 40px 40px 40px;
`

const Update = styled.div`
	color: #ef9b0f;
	cursor: pointer;
`

const Delete = styled.div`
	color: #ff2222;
	cursor: pointer;
`

class UpdateMovie extends Component {
    updateUser = event => {
        event.preventDefault()

        window.location.href = `/movies/update/${this.props.id}`
    }

    render() {
        return <Update onClick={this.updateUser}>Update</Update>
    }
}

class DeleteMovie extends Component {
    deleteUser = event => {
        event.preventDefault()

        if (
            window.confirm(
                `Do you want to delete the movie ${this.props.id} permanently?`,
            )
        ) {
            api.deleteMovieById(this.props.id)
            window.location.reload()
        }
    }

    render() {
        return <Delete onClick={this.deleteUser}>Delete</Delete>
    }
}

function MoviesList() {
	const [movies, setMovies] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => { 
		const fetchMovies = async () => {
			setIsLoading(true);

			await api.getAllMovies().then(movies => {
				setMovies(movies.data.data);
				setIsLoading(false);
			});
		}
		fetchMovies();
	}, []);

	console.log('TCL: MoviesList -> render -> movies', movies);

	const columnsTable = [
		{
			Header: 'ID',
			accessor: '_id',
			fiterable: true,
		},
		{
			Header: 'Name',
			accessor: 'name',
			fiterable: true,
		},
		{
			Header: 'Rating',
			accessor: 'rating',
			fiterable: true,
		},
		{
			Header: 'Time',
			accessor: 'time',
			Cell: props => <span>{props.value.join(' / ')}</span>,
		},
		{
			Header: '',
			accessor: '',
			Cell: function(props) {
				return (
					<span>
						<DeleteMovie id={props.original._id} />
					</span>
				);
			},
		},
		{
			Header: '',
			accessor: '',
			Cell: function(props) {
				return (
					<span>
						<UpdateMovie id={props.original._id} />
					</span>
				);
			},
		},		
	];

	let showTable = true;
	if (!movies.length) {
		showTable = false;
	}

	return(
		<Wrapper>
			{
				showTable && (
					<ReactTable
						data={movies}
						columns={columnsTable}
						loading={isLoading}
						defaultPageSize={10}
						showPageSizeOption={true}
						minRows={0}
					/>
				)
			}
		</Wrapper>
	);
}

export default MoviesList;
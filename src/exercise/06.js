// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import { PokemonForm, fetchPokemon, PokemonInfoFallback, PokemonDataView } from '../pokemon'
import { ErrorBoundary } from 'react-error-boundary'

function ErrorFallback({error, resetErrorBoundary}){
  return (
    <div role="alert">
      There was an error:{' '}
      <pre style={{ whiteSpace: 'normal' }}>{error.message}</pre>
      <button onClick={resetErrorBoundary} >Try again...</button>
    </div>
  )
}

function PokemonInfo({ pokemonName }) {
  ;
  const [state, setState] = React.useState({
    status: 'idle',
    pokemon: null,
    error: null
  })

  const { status, pokemon, error } = state;

  React.useEffect(() => {
    if (!pokemonName) {
      return
    }
    setState({ status: 'pending' });
    fetchPokemon(pokemonName).then(
      pokemonData => {
        setState({ pokemon: pokemonData, status: 'resolved' })
      },
      error => {
        console.log(error)
        setState({ error: error, status: 'rejected' })
      })
  }, [pokemonName]);


  if (status === 'idle') {
    return 'Submit a pokemon';
  } else if (status === 'pending') {
    return <PokemonInfoFallback name={pokemonName} />
  } else if (status === 'rejected') {
    console.log('rejected')
    throw error
  } else if (status === 'resolved') {
    return <PokemonDataView pokemon={pokemon} />
  }

}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  function handleReset(){
    setPokemonName('');
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary FallbackComponent={ErrorFallback} onReset={handleReset} resetKeys={[pokemonName]}>
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App

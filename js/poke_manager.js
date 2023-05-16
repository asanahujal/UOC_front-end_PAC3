class PokemonManager {
  constructor() {
    console.log('Init pokemon manager');
    this.pokemons = [];
    this.pokemon_api_url = 'https://pokeapi.co/api/v2/pokemon/';
    this.total_pokemons = 151;
  }

  add_pokemon( pokemon ) {
    this.pokemons.push( pokemon );
  }

  get_pokemons() {
    return this.pokemons;
  }

  get_pokemon( id ) {
    return this.pokemons.find( pokemon => pokemon.id === parseInt(id) );
  }

  remove_all_pokemons() {
    this.pokemons = [];
  }

  pokemon_main_template( pokemon ) {
    const div = document.createElement('div');
    div.classList.add('pokemon');
    div.innerHTML = `
        <div class="header_pokemon">
          <h3 id="pokemon_id">#${pokemon.id}</h3>
          <h3 id="pokemon_name">${pokemon.name}</h3>
        </div>
        <div id="pokemon_sprite">
          <img src="${pokemon.sprite}" alt="${pokemon.name}">
        </div>`;

    return div;
  }

  render_main() {
    const pokemons = this.get_pokemons();
    
    let section = document.createElement('section');
    for( let i = 0; i < pokemons.length; i++ ) {
      const pokemon = pokemons[i];

      if( i>0 && i%3 === 0 ) { 
        document.querySelector('article').appendChild( section );
        section = document.createElement('section');
      }

      let single_pokemon = this.pokemon_main_template( pokemon );
      section.appendChild( single_pokemon );
    }

    document.querySelector('article').appendChild( section );
  }

  async fetch_pokemons() {
    let ret = true;
    try {
      for( let i = 0; i < 6; i++ ) {
        let random_id = Math.floor( Math.random() * this.total_pokemons ) + 1;
        let url = `${this.pokemon_api_url}${random_id}`;
        await fetch( url )
          .then( response => response.json() )
          .then( data => {
            let pokemon_data = {
              id: data.id,
              name: data.name,
              sprite: data.sprites['front_default'],
              type: data.types.map( type => type.type.name ).join( ', ' ),
              height: data.height,
              weight: data.weight,
              ability: data.abilities.map( ability => ability.ability.name ).join( ', ' ),
              stat: data.stats.map( stat => {
                return {
                  name: stat.stat.name,
                  value: stat.base_stat
                }
              })
            };
            this.add_pokemon( pokemon_data );
          });
      }
    } catch (error) {
      console.log(`Error: ${error}`)
      ret = false;
    } finally {
      return ret;
    }
  }
}
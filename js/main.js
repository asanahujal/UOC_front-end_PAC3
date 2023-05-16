//Declare variables
const pokemon_manager = new PokemonManager();
const theme_key = 'selected-theme';
const stored_theme = localStorage.getItem(theme_key);

const color_palette_radios = document.querySelectorAll('input[name="color-palette"]');

// functions
const apply_theme = () => {
  const selected_theme = document.querySelector('input[name="color-palette"]:checked').value;
  document.body.className = `${selected_theme}-theme`;

  localStorage.setItem(theme_key, selected_theme);
}

const render_single_pokemon = ( pokemon_id ) => {
  const pokemon = pokemon_manager.get_pokemon( pokemon_id );

  document.querySelector('#modal #main_info').innerHTML = `
  <div class="header_pokemon">
    <h3 id="pokemon_id">#${pokemon.id}</h3>
    <h3 id="pokemon_name">${pokemon.name}</h3>
  </div>
  <div id="pokemon_sprite">
    <img src="${pokemon.sprite}" alt="${pokemon.name}">
  </div>`;
  
  document.querySelector('#modal #caract_info').innerHTML = `
  <div id="pokemon_type" class="pokemon_caract"><b>Tipo:</b> <h3>${pokemon.type}</h3></div>
  <div id="pokemon_height" class="pokemon_caract"><b>Altura:</b> <h3>${pokemon.height}</h3></div>
  <div id="pokemon_weight" class="pokemon_caract"><b>Peso:</b> <h3>${pokemon.weight}</h3></div>
  <div id="pokemon_ability" class="pokemon_caract"><b>Habilidades:</b> <h3>${pokemon.ability}</h3></div>
  <div id="pokemon_stat">
  <b>Estadísticas:</b>
    <ul>
      ${pokemon.stat.map( stat => `<li class="pokemon_caract"><b>${stat.name}:</b> <h3>${stat.value}</h3></li>` ).join('')}
    </ul>
  </div>`;

  document.querySelector('#modal').style.display = 'block';
}


const init = async () => {
  document.body.classList.add('loading');
  const fetched = await pokemon_manager.fetch_pokemons();
  if( fetched ) {
    console.log('Pokemons fetched successfully');
    pokemon_manager.render_main();

    const pokemon_divs = document.querySelectorAll( '.pokemon' );

    pokemon_divs.forEach( pokemon_div => {
      pokemon_div.addEventListener( 'click', () => {
        let pokemon_id = pokemon_div.querySelector( '#pokemon_id' ).innerHTML;
        if( pokemon_id.includes( '#' ) ) {
          pokemon_id = pokemon_id.replace( '#', '' );
        }
        render_single_pokemon( pokemon_id );
      });
    });
  } else {
    alert('Error fetching pokemons! refresh the page and try again ...')
  }
  document.body.classList.remove('loading');
}

//Add event listeners
color_palette_radios.forEach(radio => {
  radio.addEventListener('change', apply_theme);
});

document.querySelector('#modal .close').addEventListener('click', () => {
  document.querySelector('#modal').style.display = 'none';
});

document.querySelector('#btn-load').addEventListener('click', () => {
  pokemon_manager.remove_all_pokemons();
  const sections = document.querySelectorAll('article section')
  sections.forEach(section => {
    section.remove();
  });
  init();
});

//Get stored theme on init
if(stored_theme) {
  const selected_radio = document.querySelector(`input[value="${stored_theme}"]`);
  selected_radio.checked = true;
} else {
  const default_theme = 'dark';
  const selected_radio = document.querySelector(`input[value="${default_theme}"]`);
  selected_radio.checked = true;
  localStorage.setItem(theme_key, default_theme);
}

//Execute init functions
apply_theme();
init();
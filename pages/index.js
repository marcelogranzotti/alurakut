import React from 'react';
import MainGrid from '../src/components/MainGrid';
import Box from '../src/components/Box';
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet } from '../src/lib/AlurakutCommons';
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';

function ProfileSidebar(propriedades) {
  return (
    <Box as="aside">
      <img src={`https://github.com/${propriedades.usuarioAleatorio}.png`} style={{ borderRadius: '8px' }}/>
      <hr/>
      <p>
        <a className="boxLink" href={`https://github.com/${propriedades.guthubUser}`}>
          @{propriedades.usuarioAleatorio}
        </a>
      </p>
      <hr/>
      <AlurakutProfileSidebarMenuDefault/>
    </Box>
  )
}

function ProfileRelationsList(propriedades){
  console.log(propriedades);
  return(
    <div>
      <h2 className="smallTitle">{propriedades.header} ({propriedades.list.length})</h2>
      <ul>
        {propriedades.list.slice(0, 6).map((itemAtual) => {
          return(
            <li key={itemAtual.id}>
              <a target="blank" href={itemAtual.url ? itemAtual.url : `#`} key={itemAtual.title}>
                <img src={itemAtual.image}/>
                <span>{itemAtual.title}</span>
              </a>
            </li>
          )
        })}
      </ul>
    </div>
  );
}

function arrayPessoasFavoritas(githubIDs) {
  const arrayPessoas = [];
  githubIDs.map((item) => {
    arrayPessoas.push(
      {
        id: arrayPessoas.length,
        title: (item.title ? item.title : item),
        image: (item.image ? item.image : `https://github.com/${item.title ? item.title : item}.png`),
        url: (item.url ? item.url : '#')
      }
    );
  });
  return(arrayPessoas);
}

function arrayComunidades(comunidades) {
  const arrayComunidades = [];
  comunidades.map((item) => {
    arrayComunidades.push(
      {
        id: arrayComunidades.length,
        title: (item.title ? item.title : item),
        image: (item.image ? item.image : `https://picsum.photos/300/300?${Math.random()}`),
        url: (item.url ? item.url : '#')
      }
    );
  });
  return(arrayComunidades);
}

export default function Home() {
  const usuarioAleatorio = 'marcelogranzotti';

  const [comunidades, setComunidades] = React.useState(
    arrayComunidades([
      {title: 'Eu odeio acordar cedo', image: 'https://alurakut.vercel.app/capa-comunidade-01.jpg', url: 'https://www.orkut.br.com/MainCommunity?cmm=10000'},
      {title: 'Pink Floyd', image: 'https://images-na.ssl-images-amazon.com/images/I/81fVUZiXFJL._AC_SL1500_.jpg', url: 'https://www.youtube.com/channel/UCY2qt3dw2TQJxvBrDiYGHdQ'},
      {title: 'Nerdologia', url: 'https://www.youtube.com/user/nerdologia'}, 
      {title: 'SpaceToday', image: 'https://spacetoday.com.br/wp-content/uploads/2021/03/logo04-1022x470-BRANCA.png', 'url': 'https://www.youtube.com/channel/UC_Fk7hHbl7vv_7K8tYqJd5A'},
      {title: 'Alura', image: 'https://www.alura.com.br/assets/img/home/alura-logo.1616501197.svg', url: 'https://www.youtube.com/user/aluracursosonline'},
      {title: 'Star Wars', image: 'https://logodownload.org/wp-content/uploads/2015/12/star-wars-logo-0-1536x1536.png', url: 'https://www.starwars.com/'}
    ])
  );  // State Hooks

  const pessoasFavoritas = arrayPessoasFavoritas(['eusener', {title: 'juunegreiros', url: 'https://www.instagram.com/juu_negreiros/'}, {title: 'omariosouto', url: 'https://www.instagram.com/omariosouto/'}, {title: 'peas', url: 'https://www.instagram.com/paulo_hipster'}]);

  // Pegar o array de dados do github
  const [seguidores, setSeguidores] = React.useState([]);

  React.useEffect(function() {
    fetch(`https://api.github.com/users/${usuarioAleatorio}/followers`)
    .then(function (respostaDoServidor) { 
      return respostaDoServidor.json();
    })
    .then(function(respostaCompleta) {
      setSeguidores(respostaCompleta);
    });
  }, []);
  



  return (
    <>
      <AlurakutMenu githubUser={usuarioAleatorio}/>
      <MainGrid>
        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <ProfileSidebar usuarioAleatorio={usuarioAleatorio}/>
        </div>
        <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
          <Box>
            <h1 className="title">Bem vindo(a)</h1>
            <OrkutNostalgicIconSet/>
          </Box>
          <Box>
            <h2 className="title">O que você deseja fazer?</h2>
            <form onSubmit={function handleCriaComunidade(e) {
              e.preventDefault();
              const dadosDoForm = new FormData(e.target);
              const comunidade = {
                id: new Date().toISOString(),
                title: dadosDoForm.get('title'),
                image: (dadosDoForm.get('image') ? dadosDoForm.get('image') : `https://picsum.photos/300/300?${Math.random().toString}`)
              };
              //const comunidadesAtualizadas = [...comunidades, 'Alura Stars']
              setComunidades([...comunidades, comunidade]);
            }}>
              <div>
                <input 
                  placeholder="Qual vai se o nome da sua comunidade?" 
                  name="title" 
                  aria-label="Qual vai se o nome da sua comunidade?" 
                />
              </div>
              <div>
                <input 
                  placeholder="Coloque uma URL para usarmos de capa" 
                  name="image" 
                  aria-label="Coloque uma URL para usarmos de capa" 
                />
              </div>
              <button>
                Criar comunidade
              </button>
            </form>
          </Box>
        </div>
        <div className="profileRelationsArea" style={{ gridArea: 'profileRelationsArea' }}>
          <ProfileRelationsBoxWrapper>
            <ProfileRelationsList header='Seguidores' list={seguidores} />
          </ProfileRelationsBoxWrapper>
          <ProfileRelationsBoxWrapper>
            <ProfileRelationsList header='Comunidades' list={comunidades} />
          </ProfileRelationsBoxWrapper> 
          <ProfileRelationsBoxWrapper>
            <ProfileRelationsList header='Pessoas da comunidade' list={pessoasFavoritas} />
          </ProfileRelationsBoxWrapper>
        </div>
      </MainGrid>
    </>
  )
}

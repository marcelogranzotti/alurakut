import React from 'react';
import nookies from 'nookies';
import jwt from 'jsonwebtoken';
import MainGrid from '../src/components/MainGrid';
import Box from '../src/components/Box';
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet } from '../src/lib/AlurakutCommons';
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';

function ProfileSidebar(propriedades) {
  return (
    <Box as="aside">
      <img src={`https://github.com/${propriedades.usuarioAleatorio}.png`} style={{ borderRadius: '8px' }} />
      <hr />
      <p>
        <a className="boxLink" href={`https://github.com/${propriedades.guthubUser}`}>
          @{propriedades.usuarioAleatorio}
        </a>
      </p>
      <hr />
      <AlurakutProfileSidebarMenuDefault />
    </Box>
  )
}

function ProfileRelationsList(propriedades) {
  console.log(propriedades);
  return (
    <div>
      <h2 className="smallTitle">{propriedades.header} ({propriedades.list.length})</h2>
      <ul>
        {propriedades.list.slice(0, 6).map((itemAtual) => {
          return (
            <li key={itemAtual.id}>
              <a target="blank" href={itemAtual.linkUrl ? itemAtual.linkUrl : `#`} key={itemAtual.title}>
                <img src={itemAtual.imageUrl} />
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
  return (arrayPessoas);
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
  return (arrayComunidades);
}

export default function Home(props) {
  const usuarioAleatorio = props.githubUser;

  const [comunidades, setComunidades] = React.useState([]);  // State Hooks

  const pessoasFavoritas = arrayPessoasFavoritas(['eusener', { title: 'juunegreiros', url: 'https://www.instagram.com/juu_negreiros/' }, { title: 'omariosouto', url: 'https://www.instagram.com/omariosouto/' }, { title: 'peas', url: 'https://www.instagram.com/paulo_hipster' }]);

  // Pegar o array de dados do github
  const [seguidores, setSeguidores] = React.useState([]);

  React.useEffect(function () {
    // GET
    fetch(`https://api.github.com/users/${usuarioAleatorio}/followers`)
      .then(function (respostaDoServidor) {
        return respostaDoServidor.json();
      })
      .then(function (respostaCompleta) {
        setSeguidores(respostaCompleta);
      });

    // API GraphQL
    fetch('https://graphql.datocms.com', {
      method: 'POST',
      headers: {
        'Authorization': '544c20bb4b7536e0334cd28b20952f',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        'query':
          `query {
            allCommunities {
              id
              title
              creatorSlug
              imageUrl
              linkUrl
            }
          }`
      })
    })
      .then((response) => response.json())  // Resposta imediata
      .then((respostaCompleta) => {
        console.log('objetoDATO', respostaCompleta);
        const comunidadesVindasDoDato = respostaCompleta.data.allCommunities;
        setComunidades(comunidadesVindasDoDato);
      })


  }, []);

  return (
    <>
      <AlurakutMenu githubUser={usuarioAleatorio} />
      <MainGrid>
        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <ProfileSidebar usuarioAleatorio={usuarioAleatorio} />
        </div>
        <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
          <Box>
            <h1 className="title">Bem vindo(a)</h1>
            <OrkutNostalgicIconSet />
          </Box>
          <Box>
            <h2 className="title">O que você deseja fazer?</h2>
            <form onSubmit={function handleCriaComunidade(e) {
              e.preventDefault();
              const dadosDoForm = new FormData(e.target);
              const comunidade = {
                title: dadosDoForm.get('title'),
                imageUrl: (dadosDoForm.get('image') ? dadosDoForm.get('image') : `https://picsum.photos/300/300?${Math.random().toString}`),
                linkUrl: `#`,
                creatorSlug: usuarioAleatorio
              };

              fetch('/api/comunidades', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(comunidade)
              })
                .then((response) => {
                  const dados = response.json();
                  console.log(dados);
                  const comunidadesAtualizadas = [...comunidades, comunidade];
                  setComunidades(comunidadesAtualizadas);
                })

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

export async function getServerSideProps(context) {
  const cookies = nookies.get(context);
  const token = cookies.USER_TOKEN; 
  
  // Normal:        const githubUser = jwt.decode(token).githubUser;  
  // Destructuring: const { githubUser } = jwt.decode(token);  
    
  
  //console.log('cookies',cookies);
  //console.log('token', token);

  const { isAuthenticated } = await 
    fetch('https://alurakut.vercel.app/api/auth', {
      headers: {
        Authorization: token
      }
    })
    .then((resposta) => resposta.json());

  console.log('isAuthenticated', isAuthenticated);

  if(!isAuthenticated){
    return {
      redirect: {
        destination: '/login',
        permanent: false
      }
    }
  }

  const { githubUser } = jwt.decode(token);

  return {
    props: {
      githubUser   // Quando o nome da chave e da variável são o mesmo, não precisa colocar os dois
    }
  }
}
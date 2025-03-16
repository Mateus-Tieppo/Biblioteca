document.addEventListener("DOMContentLoaded", () => {
    const catalogo = document.getElementById("catalogo");
    const pesquisa = document.getElementById("pesquisa");
    const paginaLivro = document.getElementById("paginaLivro");
    const categoriasLinks = document.querySelectorAll(".dropdown-content a");
    const dropbtn = document.querySelector(".dropbtn");
    const dropdown = document.querySelector(".dropdown");

    // Função para buscar livros da API do Google Books
    async function buscarLivros(query = "Sarah j Maas") {
        try {
            queryAtual = query; // Armazena a query atual
            const resposta = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=12`);
            const dados = await resposta.json();
            mostrarLivros(dados.items);
        } catch (error) {
            console.error("Erro ao buscar livros:", error);
            catalogo.innerHTML = "<p>Erro ao carregar livros.</p>";
        }
    }

    function mostrarLivros(livros) {
        catalogo.innerHTML = ""; // Limpa o catálogo antes de carregar novos livros
        
        if (livros.length === 0) {
            catalogo.innerHTML = "<p>Nenhum livro encontrado para sua busca.</p>";
        } else {
            livros.forEach(livro => {
                const info = livro.volumeInfo;
    
                const livroElemento = document.createElement("div");
                livroElemento.classList.add("livro");
                livroElemento.innerHTML = `
                    <img src="${info.imageLinks?.thumbnail || 'placeholder.jpg'}" alt="${info.title}">
                    <h2>${info.title}</h2>
                    <p>${info.authors?.join(", ") || "Autor desconhecido"}</p>
                `;
    
                livroElemento.addEventListener("click", () => abrirPaginaLivro(info));
    
                catalogo.appendChild(livroElemento);
            });
        }
    }

    function abrirPaginaLivro(info) {
        const volumeInfo = info;
    
        const descricao = volumeInfo.description || "Sem descrição disponível.";
        const imagem = volumeInfo.imageLinks?.thumbnail || "placeholder.jpg";
        const autores = volumeInfo.authors ? volumeInfo.authors.join(", ") : "Autor(es) desconhecido(s)";
        const dataPublicacao = volumeInfo.publishedDate || "Data de publicação não disponível";
        const idioma = volumeInfo.language ? volumeInfo.language.toUpperCase() : "Idioma não disponível";
        const categorias = volumeInfo.categories ? volumeInfo.categories.join(", ") : "Categorias não disponíveis";
        const linkCompra = volumeInfo.canonicalVolumeLink || "#";
    
        paginaLivro.innerHTML = `
            <img src="${imagem}" alt="${volumeInfo.title || 'Livro sem título'}">
            <h2>${volumeInfo.title || 'Título desconhecido'}</h2>
            <p>${descricao}</p>
            <div class="informacoes">
                <div class="informacao">
                    <h3>Autores</h3>
                    <p>${autores}</p>
                </div>
                <div class="informacao">
                    <h3>Data de Publicação</h3>
                    <p>${dataPublicacao}</p>
                </div>
                <div class="informacao">
                    <h3>Idioma</h3>
                    <p>${idioma}</p>
                </div>
                <div class="informacao">
                    <h3>Categorias</h3>
                    <p>${categorias}</p>
                </div>
            </div>
            <div class="link-compra">
                <a href="${linkCompra}" target="_blank">Comprar no Google Books</a>
            </div>
            <button id="voltarBtn">Voltar</button> <!-- Botão voltar -->
        `;
    
        paginaLivro.classList.add("visible"); // Mostra a página do livro
        catalogo.classList.add("hidden"); // Esconde o catálogo

        // Adiciona o evento ao botão "Voltar"
        document.getElementById("voltarBtn").addEventListener("click", fecharPaginaLivro);
    }
    
    function fecharPaginaLivro() {
        paginaLivro.classList.remove("visible"); // Remove a classe 'visible' para esconder
        catalogo.classList.remove("hidden"); // Restaura a visibilidade do catálogo

        // Recarrega os livros com a pesquisa anterior
        buscarLivros(queryAtual);
    }

    pesquisa.addEventListener("input", () => {
        const pesquisaValor = pesquisa.value;
        if (pesquisaValor === "") {
            buscarLivros(); // Trigger default search if input is empty
        } else {
            buscarLivros(pesquisaValor);
        }
    });

    // Função de Dropdown
    dropbtn.addEventListener("click", (event) => {
        event.stopPropagation(); // Previne a propagação do clique para outros elementos
        dropdown.classList.toggle("active");
    });

    // Fecha o dropdown se o usuário clicar fora
    document.addEventListener("click", (event) => {
        if (!dropdown.contains(event.target) && !dropbtn.contains(event.target)) {
            dropdown.classList.remove("active");
        }
    });

    categoriasLinks.forEach(link => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            const categoria = event.target.getAttribute("data-categoria");
            buscarLivros(categoria); // Filtra os livros pela categoria
            dropdown.classList.remove("active"); // Fecha o dropdown após a escolha
        });
    });

    // Carrega livros iniciais
    buscarLivros();
});
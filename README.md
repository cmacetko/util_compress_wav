# util_compress_wav

>  util_compress_wav é uma API, que roda em Nodejs que reduz o tamanho de arquivos de **Áudio WAV**

![Language](https://img.shields.io/badge/language-nodejs-orange)
![Platforms](https://img.shields.io/badge/platforms-Windows%2C%20macOS%20and%20Linux-blue)
![License](https://img.shields.io/github/license/cmacetko/util_compress_wav)
[![HitCount](http://hits.dwyl.com/cmacetko/util_compress_wav.svg)](http://hits.dwyl.com/cmacetko/util_compress_wav)

## Porta

A aplicação roda na porta **9000**

## Requisição

Para executar o comando, é necessário enviar um **POST** para **http://127.0.0.1:9000/gerar**.

No corpo da requisição, envie um Json semelhante ao Json abaixo:
```json
{
  "arquivo": "https://www.meusite.com.br/audio.wav"
}
```

Nesta requisição precisamos preencher os campos:
- **arquivo:** A url completa de onde o arquivo WAV esta localizado

Em caso de **Falha** será retornado a causa na váriavel **Msg** com HttpCode **500**:
```json
{
"Msg": "Url nao informada"
}
```

Em caso de **Sucesso** será retornado o arquivo, em base64, na váriavel **Arquivo** e o **Tamanho Original** e o **Tamanho Resultado** com HttpCode **200**:
```json
{
"TamanhoOrigem": "1016 KB",
"TamanhoResultado": "254 KB",
"Arquivo": "UklGRkb4AwBXQVZFZm10IBAAAAABAAEA4C4AAMBdAAACABAATElTVBoAAABJTkZPSVNGVA0AAABMYXZmNjA"
}
```

# Contato

**Paloma Macetko**
- cmacetko@gmail.com
- https://github.com/cmacetko/
- https://www.npmjs.com/~cmacetko
- https://cmacetko.medium.com
- https://www.facebook.com/cmacetko
- https://www.instagram.com/cmacetko/
- https://twitter.com/cmacetko
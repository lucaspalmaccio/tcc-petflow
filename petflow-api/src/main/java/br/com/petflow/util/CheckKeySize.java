package br.com.petflow.util;

import java.util.Base64;

public class CheckKeySize {
    public static void main(String[] args) {
        // Cole aqui a chave do seu application.properties
        String keyBase64 = "3pltDoiNzIdEId5ZiZymd/au6wqdrbaX0d5EEsyOJy8=";

        // Decodifica e mostra o tamanho em bits
        byte[] decoded = Base64.getDecoder().decode(keyBase64);
        System.out.println("Tamanho da chave: " + decoded.length * 8 + " bits");
    }
}

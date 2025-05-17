package com.adotapet.adotapet.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.stream.Collectors;
import java.util.List;
import java.nio.file.Paths;
import java.util.Base64;
import java.util.HashMap;
import java.nio.file.Path;
import java.io.IOException;
import java.nio.file.Files;
import java.util.Map;

import com.adotapet.adotapet.ApiResponse;
import com.adotapet.adotapet.repository.DogPhotoRepository;
import com.adotapet.adotapet.repository.DogRepository;
import com.adotapet.adotapet.entities.DogPhotoEntity;
import com.adotapet.adotapet.entities.UserEntity;
import com.adotapet.adotapet.entities.DogEntity;



@Service
public class DogPhotoService {

    @Autowired
    private DogPhotoRepository dogPhotoRepository;
    private DogRepository dogRepository;

    public DogPhotoService(DogPhotoRepository dogPhotoRepository, DogRepository dogRepository) {
        this.dogPhotoRepository = dogPhotoRepository;
        this.dogRepository = dogRepository;
    }


    public ApiResponse<DogPhotoEntity> uploadDogPhoto(Integer dogId, String base64Image) {
        Optional<DogEntity> dogOptional = dogRepository.findById(dogId);
        if (dogOptional.isEmpty()) {
            return new ApiResponse<>("Dog not found", null);
        }
    
        DogPhotoEntity dogPhotoEntity = new DogPhotoEntity();
        dogPhotoEntity.setDog(dogOptional.get());
    
        try {
            //1. Salvar a entidade primeiro para gerar o ID no banco
            dogPhotoEntity = dogPhotoRepository.save(dogPhotoEntity);
            Integer photoId = dogPhotoEntity.getId(); // Obtém o ID gerado
    
            //2. Verifica se a string contém o prefixo "data:image/png;base64,"
            if (base64Image.contains(",")) {
                base64Image = base64Image.split(",")[1]; // Remove o prefixo
            }
    
            //3. Decodificação da string Base64
            byte[] imageBytes = Base64.getDecoder().decode(base64Image);
    
            //4. Define o diretório do cachorro usando seu ID
            Path dogDirectory = Paths.get("src/main/resources/static/dogs/" + dogId);
            if (!Files.exists(dogDirectory)) {
                Files.createDirectories(dogDirectory); // Cria a pasta se não existir
            }
    
            //5. Define o nome do arquivo como o ID do `DogPhotoEntity`
            String imageFileName = photoId + ".jpg";
            Path destinationFile = dogDirectory.resolve(imageFileName);
    
            //6. Salvar a imagem no servidor
            Files.write(destinationFile, imageBytes);
    
            //7. Atualizar o caminho da imagem no banco de dados
            dogPhotoEntity.setImgUrl(destinationFile.toAbsolutePath().toString());
            dogPhotoRepository.save(dogPhotoEntity);

            DogEntity updateDog = dogOptional.get();
            updateDog.addUrlPhoto(destinationFile.toString());

            dogRepository.save(updateDog);
    
            return new ApiResponse<>("Foto enviada com sucesso", dogPhotoEntity);
        } catch (IOException e) {
            return new ApiResponse<>("Erro ao salvar a foto: " + e.getMessage(), null);
        } catch (IllegalArgumentException e) {
            return new ApiResponse<>("Base64 inválido: " + e.getMessage(), null);
        }
    }

        //atualizar dog, que a url foi deletada
    public ApiResponse<DogPhotoEntity> deleteDogPhoto(DogPhotoEntity dogPhoto) {
    Optional<DogPhotoEntity> dogPhotoOptional = dogPhotoRepository.findById(dogPhoto.getId());
    
    if (dogPhotoOptional.isPresent()) {
        DogPhotoEntity photo = dogPhotoOptional.get();
        
        // Obtém o caminho da imagem salva no banco de dados
        String imgPath = photo.getImgUrl();
        if (imgPath != null && !imgPath.isEmpty()) {
            Path photoPath = Paths.get(imgPath);
            
            try {
                // Verifica se o arquivo existe no servidor e o deleta
                if (Files.exists(photoPath)) {
                    Files.delete(photoPath);
                } else {
                    return new ApiResponse<>("Image file not found on server", null);
                }
            } catch (IOException e) {
                return new ApiResponse<>("Error deleting image file: " + e.getMessage(), null);
            }
        }

        //Remove a referência da foto no banco de dados
        dogPhotoRepository.delete(photo);

        return new ApiResponse<>("Dog photo deleted successfully", null);
    } else {
        return new ApiResponse<>("Dog photo not found", null);
    }
}


    public ApiResponse<List<Map<String, Object>>> findAllByDogId(Integer dogId) {
    Optional<DogEntity> dogOptional = dogRepository.findById(dogId);
    if (dogOptional.isEmpty()) {
        return new ApiResponse<>("Dog not found", null);
    }

    // Obtém as fotos do banco
    List<DogPhotoEntity> dogPhotos = dogPhotoRepository.findByDogId(dogId);

    // Transforma a lista para retornar apenas `id` e `imgUrl`
    List<Map<String, Object>> result = dogPhotos.stream()
        .map(photo -> {
            Map<String, Object> photoMap = new HashMap<>();
            photoMap.put("id", photo.getId());        // Explicitamente Object
            photoMap.put("imgUrl", photo.getImgUrl()); // Explicitamente Object
            return photoMap;
        })
        .collect(Collectors.toList()); // 🔹 Especifica a coleta como List<Map<String, Object>>

    return new ApiResponse<>("Dog photos found", result);
}





}

package com.example.airlist.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BoardRequestDto {

    private String title;
    private String content;
    private String author;
    private boolean pinned;
}
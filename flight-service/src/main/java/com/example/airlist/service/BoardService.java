package com.example.airlist.service;

import com.example.airlist.dto.BoardRequestDto;
import com.example.airlist.dto.BoardResponseDto;
import com.example.airlist.entity.Board;
import com.example.airlist.repository.BoardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BoardService {

    private final BoardRepository boardRepository;
    public BoardService(BoardRepository boardRepository) {
        this.boardRepository = boardRepository;
    }

    public BoardResponseDto createBoard(BoardRequestDto requestDto) {
        Board board = Board.builder()
                .title(requestDto.getTitle())
                .content(requestDto.getContent())
                .author(requestDto.getAuthor())
                .pinned(requestDto.isPinned())
                .build();

        Board saved = boardRepository.save(board);
        return toDto(saved);
    }

    public List<BoardResponseDto> getAllBoards() {
        return boardRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public BoardResponseDto getBoardById(Long id) {
        Board board = boardRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));
        return toDto(board);
    }

    public BoardResponseDto updateBoard(Long id, BoardRequestDto requestDto) {
        Board board = boardRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));

        board.setTitle(requestDto.getTitle());
        board.setContent(requestDto.getContent());
        board.setAuthor(requestDto.getAuthor());
        board.setPinned(requestDto.isPinned());

        Board updated = boardRepository.save(board);
        return toDto(updated);
    }

    public void deleteBoard(Long id) {
        if (!boardRepository.existsById(id)) {
            throw new RuntimeException("게시글이 존재하지 않습니다.");
        }
        boardRepository.deleteById(id);
    }

    private BoardResponseDto toDto(Board board) {
        return BoardResponseDto.builder()
                .id(board.getId())
                .title(board.getTitle())
                .content(board.getContent())
                .author(board.getAuthor())
                .createdDate(board.getCreatedDate())
                .pinned(board.isPinned())
                .build();
    }
}


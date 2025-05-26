package com.example.demo.reservationservice.entitiy;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.Builder;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Builder
@NoArgsConstructor
public class DeletedReservation {
    @Id
    @GeneratedValue
    private Long id;

    private Long uId;
    private String groupId;
    private String reason;
    private LocalDateTime deletedAt;
    private boolean isChecked = false;


    public DeletedReservation(Long id, Long uId, String groupId, String reason, LocalDateTime deletedAt, boolean isChecked) {
        this.id = id;
        this.uId = uId;
        this.groupId = groupId;
        this.reason = reason;
        this.deletedAt = deletedAt;
        this.isChecked = isChecked;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public boolean isChecked() {
        return isChecked;
    }

    public void setChecked(boolean checked) {
        isChecked = checked;
    }

    public LocalDateTime getDeletedAt() {
        return deletedAt;
    }

    public void setDeletedAt(LocalDateTime deletedAt) {
        this.deletedAt = deletedAt;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getGroupId() {
        return groupId;
    }

    public void setGroupId(String groupId) {
        this.groupId = groupId;
    }

    public Long getuId() {
        return uId;
    }

    public void setuId(Long uId) {
        this.uId = uId;
    }
}


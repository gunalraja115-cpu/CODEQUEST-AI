package com.coderoyale.auth;

import com.coderoyale.rank.Rank;
import com.coderoyale.rank.RankRepository;
import com.coderoyale.rank.UserRating;
import com.coderoyale.rank.UserRatingRepository;
import com.coderoyale.user.User;
import com.coderoyale.user.UserProfile;
import com.coderoyale.user.UserProfileRepository;
import com.coderoyale.user.UserRepository;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final UserRatingRepository userRatingRepository;
    private final RankRepository rankRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    public AuthService(UserRepository userRepository,
                       UserProfileRepository userProfileRepository,
                       UserRatingRepository userRatingRepository,
                       RankRepository rankRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtils jwtUtils) {
        this.userRepository = userRepository;
        this.userProfileRepository = userProfileRepository;
        this.userRatingRepository = userRatingRepository;
        this.rankRepository = rankRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
    }

    @Transactional
    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByUsername(req.getUsername())) {
            throw new IllegalArgumentException("Callsign is already in combat use: " + req.getUsername());
        }
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new IllegalArgumentException("Quantum email is already registered: " + req.getEmail());
        }

        String userId = UUID.randomUUID().toString();
        User user = new User(userId, req.getUsername(), req.getEmail(), passwordEncoder.encode(req.getPassword()), "ROLE_USER");
        userRepository.save(user);

        UserProfile profile = new UserProfile(user, req.getUsername(), req.getAvatarClass(), "🥷");
        userProfileRepository.save(profile);

        Rank defaultRank = rankRepository.findById("bronze")
                .orElseGet(() -> rankRepository.save(new Rank("bronze", "Bronze", 1, 0, 999, "🛡️", "#cd7f32")));
        UserRating rating = new UserRating(user, defaultRank);
        userRatingRepository.save(rating);

        String token = jwtUtils.generateToken(user.getUsername(), user.getRole(), user.getId());
        return new AuthResponse(token, user.getId(), user.getUsername(), user.getRole(), rating.getMmr(), defaultRank.getName());
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest req) {
        User user = userRepository.findByUsername(req.getUsername())
                .orElseThrow(() -> new BadCredentialsException("Invalid username or password"));

        if (!passwordEncoder.matches(req.getPassword(), user.getPasswordHash())) {
            throw new BadCredentialsException("Invalid username or password");
        }

        UserRating rating = userRatingRepository.findByUserId(user.getId())
                .orElse(new UserRating(user, null));

        String rankName = rating.getCurrentRank() != null ? rating.getCurrentRank().getName() : "Unranked";
        String token = jwtUtils.generateToken(user.getUsername(), user.getRole(), user.getId());
        return new AuthResponse(token, user.getId(), user.getUsername(), user.getRole(), rating.getMmr(), rankName);
    }
}

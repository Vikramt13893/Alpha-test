package com.alpha.domain;

import java.util.List;
import java.util.Set;

/**
 * Fixed catalog shown in the UI and enforced on upload.
 */
public final class CanonicalVideoCategories {

    private CanonicalVideoCategories() {}

    /** Display/search order (same as product definition). */
    public static final List<String> ALL = List.of(
            "Entertainment",
            "Music",
            "Movies & Trailers",
            "TV Shows / Web Series",
            "Gaming",
            "Sports",
            "News",
            "Education / Learning",
            "How-To / Tutorials",
            "Technology",
            "Lifestyle",
            "Fashion & Beauty",
            "Health & Fitness",
            "Food & Cooking",
            "Travel",
            "Vlogs / Personal",
            "Comedy",
            "Kids & Family",
            "Animation",
            "Science",
            "Finance / Business",
            "Motivation / Self-Improvement",
            "Art & Creativity",
            "DIY / Crafts",
            "Pets & Animals",
            "Automotive",
            "Real Estate",
            "Spirituality / Religion"
    );

    private static final Set<String> ALLOWED = Set.copyOf(ALL);

    public static boolean isAllowed(String category) {
        if (category == null) {
            return false;
        }
        return ALLOWED.contains(category.trim());
    }
}

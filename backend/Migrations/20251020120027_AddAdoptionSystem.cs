using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Home4Paws.API.Migrations
{
    /// <inheritdoc />
    public partial class AddAdoptionSystem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("Npgsql:PostgresExtension:postgis", ",,");

            migrationBuilder.CreateTable(
                name: "adoption_listings",
                schema: "development",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    user_id = table.Column<int>(type: "integer", nullable: false),
                    pet_name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    pet_type = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    breed = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    age_years = table.Column<int>(type: "integer", nullable: true),
                    age_months = table.Column<int>(type: "integer", nullable: true),
                    gender = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    size = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    color = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    description = table.Column<string>(type: "text", nullable: true),
                    health_status = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    vaccination_status = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    is_spayed_neutered = table.Column<bool>(type: "boolean", nullable: false),
                    is_house_trained = table.Column<bool>(type: "boolean", nullable: false),
                    good_with_kids = table.Column<bool>(type: "boolean", nullable: false),
                    good_with_pets = table.Column<bool>(type: "boolean", nullable: false),
                    energy_level = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    special_needs = table.Column<string>(type: "text", nullable: true),
                    adoption_type = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    adoption_fee = table.Column<decimal>(type: "numeric(10,2)", nullable: false, defaultValue: 0m),
                    rehoming_reason = table.Column<string>(type: "text", nullable: true),
                    contact_name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    contact_phone = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    contact_email = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    location = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    city = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    province = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    district = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    latitude = table.Column<double>(type: "double precision", nullable: true),
                    longitude = table.Column<double>(type: "double precision", nullable: true),
                    photo_urls = table.Column<string[]>(type: "jsonb", nullable: false),
                    video_url = table.Column<string>(type: "text", nullable: true),
                    status = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false, defaultValue: "Pending"),
                    admin_notes = table.Column<string>(type: "text", nullable: true),
                    rejection_reason = table.Column<string>(type: "text", nullable: true),
                    approved_by_admin_id = table.Column<int>(type: "integer", nullable: true),
                    approved_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    views = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    favorites_count = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    is_featured = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    is_urgent = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()"),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()"),
                    adopted_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_adoption_listings", x => x.id);
                    table.ForeignKey(
                        name: "FK_adoption_listings_users_user_id",
                        column: x => x.user_id,
                        principalSchema: "development",
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "pet_reports",
                schema: "development",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                    type = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    breed = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    color = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    age = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    gender = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    size = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    description = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    report_type = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    status = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    date_reported = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()"),
                    lost_or_found_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    location = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    latitude = table.Column<double>(type: "double precision", nullable: true),
                    longitude = table.Column<double>(type: "double precision", nullable: true),
                    contact_name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    phone = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    email = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    photo_urls = table.Column<string[]>(type: "jsonb", nullable: false),
                    identifying_features = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    medical_conditions = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    is_chipped = table.Column<bool>(type: "boolean", nullable: false),
                    chip_number = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    has_reward = table.Column<bool>(type: "boolean", nullable: false),
                    reward_amount = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    views = table.Column<int>(type: "integer", nullable: false),
                    is_urgent = table.Column<bool>(type: "boolean", nullable: false),
                    is_closed = table.Column<bool>(type: "boolean", nullable: false),
                    closed_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    closure_reason = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()"),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()"),
                    admin_notes = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_pet_reports", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "adoption_applications",
                schema: "development",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    listing_id = table.Column<int>(type: "integer", nullable: false),
                    applicant_id = table.Column<int>(type: "integer", nullable: false),
                    applicant_name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    applicant_phone = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    applicant_email = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    applicant_address = table.Column<string>(type: "text", nullable: false),
                    housing_type = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    has_yard = table.Column<bool>(type: "boolean", nullable: false),
                    other_pets = table.Column<string>(type: "text", nullable: true),
                    household_members = table.Column<int>(type: "integer", nullable: true),
                    has_children = table.Column<bool>(type: "boolean", nullable: false),
                    pet_experience = table.Column<string>(type: "text", nullable: true),
                    why_adopt = table.Column<string>(type: "text", nullable: false),
                    status = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false, defaultValue: "Pending"),
                    owner_notes = table.Column<string>(type: "text", nullable: true),
                    applied_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()"),
                    reviewed_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()"),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_adoption_applications", x => x.id);
                    table.ForeignKey(
                        name: "FK_adoption_applications_adoption_listings_listing_id",
                        column: x => x.listing_id,
                        principalSchema: "development",
                        principalTable: "adoption_listings",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_adoption_applications_users_applicant_id",
                        column: x => x.applicant_id,
                        principalSchema: "development",
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "adoption_favorites",
                schema: "development",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    user_id = table.Column<int>(type: "integer", nullable: false),
                    listing_id = table.Column<int>(type: "integer", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_adoption_favorites", x => x.id);
                    table.ForeignKey(
                        name: "FK_adoption_favorites_adoption_listings_listing_id",
                        column: x => x.listing_id,
                        principalSchema: "development",
                        principalTable: "adoption_listings",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_adoption_favorites_users_user_id",
                        column: x => x.user_id,
                        principalSchema: "development",
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_feedbacks_is_approved",
                schema: "development",
                table: "feedbacks",
                column: "is_approved");

            migrationBuilder.CreateIndex(
                name: "IX_feedbacks_is_featured",
                schema: "development",
                table: "feedbacks",
                column: "is_featured");

            migrationBuilder.CreateIndex(
                name: "IX_adoption_applications_applicant_id",
                schema: "development",
                table: "adoption_applications",
                column: "applicant_id");

            migrationBuilder.CreateIndex(
                name: "IX_adoption_applications_listing_id",
                schema: "development",
                table: "adoption_applications",
                column: "listing_id");

            migrationBuilder.CreateIndex(
                name: "IX_adoption_applications_listing_id_applicant_id",
                schema: "development",
                table: "adoption_applications",
                columns: new[] { "listing_id", "applicant_id" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_adoption_favorites_listing_id",
                schema: "development",
                table: "adoption_favorites",
                column: "listing_id");

            migrationBuilder.CreateIndex(
                name: "IX_adoption_favorites_user_id_listing_id",
                schema: "development",
                table: "adoption_favorites",
                columns: new[] { "user_id", "listing_id" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_adoption_listings_adoption_type",
                schema: "development",
                table: "adoption_listings",
                column: "adoption_type");

            migrationBuilder.CreateIndex(
                name: "IX_adoption_listings_city",
                schema: "development",
                table: "adoption_listings",
                column: "city");

            migrationBuilder.CreateIndex(
                name: "IX_adoption_listings_created_at",
                schema: "development",
                table: "adoption_listings",
                column: "created_at");

            migrationBuilder.CreateIndex(
                name: "IX_adoption_listings_pet_type",
                schema: "development",
                table: "adoption_listings",
                column: "pet_type");

            migrationBuilder.CreateIndex(
                name: "IX_adoption_listings_status",
                schema: "development",
                table: "adoption_listings",
                column: "status");

            migrationBuilder.CreateIndex(
                name: "IX_adoption_listings_user_id",
                schema: "development",
                table: "adoption_listings",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "IX_pet_reports_location",
                schema: "development",
                table: "pet_reports",
                column: "location");

            migrationBuilder.CreateIndex(
                name: "IX_pet_reports_lost_or_found_date",
                schema: "development",
                table: "pet_reports",
                column: "lost_or_found_date");

            migrationBuilder.CreateIndex(
                name: "IX_pet_reports_report_type",
                schema: "development",
                table: "pet_reports",
                column: "report_type");

            migrationBuilder.CreateIndex(
                name: "IX_pet_reports_status",
                schema: "development",
                table: "pet_reports",
                column: "status");

            migrationBuilder.CreateIndex(
                name: "IX_pet_reports_type",
                schema: "development",
                table: "pet_reports",
                column: "type");

            migrationBuilder.CreateIndex(
                name: "IX_PetReports_Location_Spatial",
                schema: "development",
                table: "pet_reports",
                columns: new[] { "latitude", "longitude" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "adoption_applications",
                schema: "development");

            migrationBuilder.DropTable(
                name: "adoption_favorites",
                schema: "development");

            migrationBuilder.DropTable(
                name: "pet_reports",
                schema: "development");

            migrationBuilder.DropTable(
                name: "adoption_listings",
                schema: "development");

            migrationBuilder.DropIndex(
                name: "IX_feedbacks_is_approved",
                schema: "development",
                table: "feedbacks");

            migrationBuilder.DropIndex(
                name: "IX_feedbacks_is_featured",
                schema: "development",
                table: "feedbacks");

            migrationBuilder.AlterDatabase()
                .OldAnnotation("Npgsql:PostgresExtension:postgis", ",,");
        }
    }
}

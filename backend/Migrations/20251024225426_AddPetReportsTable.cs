using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Home4Paws.API.Migrations
{
    /// <inheritdoc />
    public partial class AddPetReportsTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("Npgsql:PostgresExtension:postgis", ",,");

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
                name: "pet_reports",
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
